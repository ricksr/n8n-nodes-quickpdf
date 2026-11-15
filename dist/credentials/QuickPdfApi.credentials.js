"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickPdfApi = void 0;
class QuickPdfApi {
    constructor() {
        this.name = "quickPdfApi";
        this.displayName = "Quick PDF Tools API";
        this.documentationUrl = "https://quickpdftools.net/developers/";
        this.icon = {
            light: "file:quickpdf.svg",
            dark: "file:quickpdf.svg",
        };
        this.supportedNodes = ["n8n-nodes-quickpdf.quickPdf"];
        this.properties = [
            {
                displayName: "API Key",
                name: "apiKey",
                type: "string",
                typeOptions: { password: true },
                default: "",
                required: true,
                description: 'Bearer key starting with qpdf_live_ (from quickpdftools.net/developers)',
            },
            {
                displayName: "API Base URL",
                name: "apiBase",
                type: "string",
                default: "https://api.quickpdftools.net",
                required: true,
                description: "Override for staging or self-hosted API",
            },
        ];
        this.authenticate = {
            type: "generic",
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: "={{$credentials.apiBase.replace(/\\/$/, '')}}",
                url: "/api/v1/capabilities",
                method: "GET",
            },
        };
    }
}
exports.QuickPdfApi = QuickPdfApi;
