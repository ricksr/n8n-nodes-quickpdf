"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickPdf = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class QuickPdf {
    constructor() {
        this.description = {
            displayName: "Quick PDF Tools",
            name: "quickPdf",
            icon: {
                light: "file:quickpdf.svg",
                dark: "file:quickpdf.dark.svg",
            },
            group: ["transform"],
            version: [1],
            subtitle: '={{$parameter["operation"]}}',
            description: "Server-side PDF unlock, protect, and repair (Quick PDF Tools API v1)",
            defaults: { name: "Quick PDF" },
            usableAsTool: true,
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [{ name: "quickPdfApi", required: true }],
            properties: [
                {
                    displayName: "Resource",
                    name: "resource",
                    type: "options",
                    noDataExpression: true,
                    options: [
                        {
                            name: "Document",
                            value: "document",
                            description: "PDF file operations via Quick PDF Tools API",
                        },
                    ],
                    default: "document",
                    required: true,
                },
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ["document"],
                        },
                    },
                    options: [
                        { name: "Unlock", value: "unlock", action: "Unlock a PDF with a known password" },
                        { name: "Protect", value: "protect", action: "Encrypt a PDF with a password" },
                        { name: "Repair", value: "repair", action: "Repair damaged PDF structure" },
                    ],
                    default: "unlock",
                    required: true,
                },
                {
                    displayName: "Binary Property",
                    name: "binaryPropertyName",
                    type: "string",
                    default: "data",
                    displayOptions: {
                        show: {
                            resource: ["document"],
                        },
                    },
                    description: "Input PDF binary field from the previous node",
                },
                {
                    displayName: "Password",
                    name: "password",
                    type: "string",
                    typeOptions: { password: true },
                    default: "",
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ["document"],
                            operation: ["unlock", "protect"],
                        },
                    },
                    description: "Password for unlock or protect",
                },
                {
                    displayName: "Output Binary Property",
                    name: "outputBinaryPropertyName",
                    type: "string",
                    default: "data",
                    displayOptions: {
                        show: {
                            resource: ["document"],
                        },
                    },
                    description: "Where to write the resulting PDF bytes",
                },
            ],
        };
    }
    async execute() {
        var _a, _b;
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials("quickPdfApi");
        const apiBase = String(credentials.apiBase || "https://api.quickpdftools.net").replace(/\/$/, "");
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter("resource", i);
                if (resource !== "document") {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: `Unknown resource "${resource}"` });
                }
                const operation = this.getNodeParameter("operation", i);
                const binaryPropertyName = this.getNodeParameter("binaryPropertyName", i);
                const outputBinaryPropertyName = this.getNodeParameter("outputBinaryPropertyName", i);
                const binary = (_a = items[i].binary) === null || _a === void 0 ? void 0 : _a[binaryPropertyName];
                if (!(binary === null || binary === void 0 ? void 0 : binary.data)) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                        message: `No binary data on property "${binaryPropertyName}"`,
                    });
                }
                const buffer = Buffer.from(binary.data, "base64");
                const form = new FormData();
                const mime = binary.mimeType || "application/pdf";
                form.append("file", new Blob([new Uint8Array(buffer)], { type: mime }), binary.fileName || "document.pdf");
                if (operation !== "repair") {
                    const password = this.getNodeParameter("password", i);
                    if (!password) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: "Password is required for this operation" });
                    }
                    form.append("password", password);
                }
                const response = await this.helpers.httpRequestWithAuthentication.call(this, "quickPdfApi", {
                    method: "POST",
                    url: `${apiBase}/api/v1/pdf/${operation}`,
                    body: form,
                    encoding: "arraybuffer",
                    returnFullResponse: true,
                    json: false,
                });
                const statusCode = Number(response.statusCode || 0);
                const body = Buffer.isBuffer(response.body)
                    ? response.body
                    : Buffer.from(response.body);
                const contentType = String(((_b = response.headers) === null || _b === void 0 ? void 0 : _b["content-type"]) || "").toLowerCase();
                if (statusCode >= 400 || contentType.includes("application/json")) {
                    let message = `Quick PDF API error (${statusCode || "unknown"})`;
                    try {
                        const j = JSON.parse(body.toString("utf8"));
                        message = j.error || j.code || message;
                    }
                    catch {
                        /* non-JSON body */
                    }
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), { message });
                }
                const outName = operation === "unlock"
                    ? (binary.fileName || "document.pdf").replace(/\.pdf$/i, "-unlocked.pdf")
                    : operation === "protect"
                        ? (binary.fileName || "document.pdf").replace(/\.pdf$/i, "-protected.pdf")
                        : (binary.fileName || "document.pdf").replace(/\.pdf$/i, "-repaired.pdf");
                returnData.push({
                    json: {
                        ...items[i].json,
                        quickPdf: { resource, operation, apiBase, bytes: body.length },
                    },
                    binary: {
                        ...(items[i].binary || {}),
                        [outputBinaryPropertyName]: await this.helpers.prepareBinaryData(body, outName, "application/pdf"),
                    },
                    pairedItem: { item: i },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
                    continue;
                }
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
            }
        }
        return [returnData];
    }
}
exports.QuickPdf = QuickPdf;
