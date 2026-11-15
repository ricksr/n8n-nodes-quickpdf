import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { NodeApiError, NodeConnectionType } from "n8n-workflow";

type PdfOperation = "unlock" | "protect" | "repair";

export class QuickPdf implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Quick PDF Tools",
    name: "quickPdf",
    icon: "file:quickpdf.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Server-side PDF unlock, protect, and repair (Quick PDF Tools API v1)",
    defaults: { name: "Quick PDF" },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: "quickPdfApi", required: true }],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        options: [
          { name: "Unlock", value: "unlock", description: "Remove password when password is known" },
          { name: "Protect", value: "protect", description: "Encrypt with a password" },
          { name: "Repair", value: "repair", description: "Rebuild damaged cross-references" },
        ],
        default: "unlock",
      },
      {
        displayName: "Binary Property",
        name: "binaryPropertyName",
        type: "string",
        default: "data",
        description: "Input PDF binary field from the previous node",
      },
      {
        displayName: "Password",
        name: "password",
        type: "string",
        typeOptions: { password: true },
        default: "",
        displayOptions: {
          show: { operation: ["unlock", "protect"] },
        },
        description: "Password for unlock or protect",
      },
      {
        displayName: "Output Binary Property",
        name: "outputBinaryPropertyName",
        type: "string",
        default: "data",
        description: "Where to write the resulting PDF bytes",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const credentials = await this.getCredentials("quickPdfApi");
    const apiBase = String(credentials.apiBase || "https://api.quickpdftools.net").replace(/\/$/, "");
    const apiKey = String(credentials.apiKey || "");

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as PdfOperation;
        const binaryPropertyName = this.getNodeParameter("binaryPropertyName", i) as string;
        const outputBinaryPropertyName = this.getNodeParameter("outputBinaryPropertyName", i) as string;

        const binary = items[i].binary?.[binaryPropertyName];
        if (!binary?.data) {
          throw new NodeApiError(this.getNode(), {
            message: `No binary data on property "${binaryPropertyName}"`,
          });
        }

        const buffer = Buffer.from(binary.data, "base64");
        const form = new FormData();
        const mime = binary.mimeType || "application/pdf";
        form.append(
          "file",
          new Blob([buffer], { type: mime }),
          binary.fileName || "document.pdf",
        );

        if (operation !== "repair") {
          const password = this.getNodeParameter("password", i) as string;
          if (!password) {
            throw new NodeApiError(this.getNode(), { message: "Password is required for this operation" });
          }
          form.append("password", password);
        }

        const response = await this.helpers.httpRequest({
          method: "POST",
          url: `${apiBase}/api/v1/pdf/${operation}`,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: form,
          encoding: "arraybuffer",
          returnFullResponse: true,
          json: false,
        });

        const statusCode = Number(response.statusCode || 0);
        const body = Buffer.isBuffer(response.body)
          ? response.body
          : Buffer.from(response.body as ArrayBuffer);
        const contentType = String(response.headers?.["content-type"] || "").toLowerCase();

        if (statusCode >= 400 || contentType.includes("application/json")) {
          let message = `Quick PDF API error (${statusCode || "unknown"})`;
          try {
            const j = JSON.parse(body.toString("utf8")) as { error?: string; code?: string };
            message = j.error || j.code || message;
          } catch {
            /* non-JSON body */
          }
          throw new NodeApiError(this.getNode(), { message });
        }

        const outName =
          operation === "unlock"
            ? (binary.fileName || "document.pdf").replace(/\.pdf$/i, "-unlocked.pdf")
            : operation === "protect"
              ? (binary.fileName || "document.pdf").replace(/\.pdf$/i, "-protected.pdf")
              : (binary.fileName || "document.pdf").replace(/\.pdf$/i, "-repaired.pdf");

        const newItem: INodeExecutionData = {
          json: {
            ...items[i].json,
            quickPdf: { operation, apiBase, bytes: body.length },
          },
          binary: {
            ...(items[i].binary || {}),
            [outputBinaryPropertyName]: await this.helpers.prepareBinaryData(
              body,
              outName,
              "application/pdf",
            ),
          },
        };
        returnData.push(newItem);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}