import type { ICredentialType, INodeProperties } from "n8n-workflow";

export class QuickPdfApi implements ICredentialType {
  name = "quickPdfApi";

  displayName = "Quick PDF Tools API";

  documentationUrl = "https://quickpdftools.net/developers/";

  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
      description: 'Bearer key starting with qpdf_live_ (from quickpdftools.net/developers)',
    },
    {
      displayName: "API Base URL",
      name: "apiBase",
      type: "string",
      default: "https://api.quickpdftools.net",
      description: "Override for staging or self-hosted API",
    },
  ];

  authenticate = {
    type: "generic" as const,
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };
}