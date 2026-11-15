"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickPdfApi = void 0;
class QuickPdfApi {
    constructor() {
        this.name = "quickPdfApi";
        this.displayName = "Quick PDF Tools API";
        this.documentationUrl = "https://quickpdftools.net/developers/";
        this.properties = [
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
        this.authenticate = {
            type: "generic",
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.QuickPdfApi = QuickPdfApi;
