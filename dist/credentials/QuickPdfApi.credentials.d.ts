import type { ICredentialTestRequest, ICredentialType, INodeProperties } from "n8n-workflow";
export declare class QuickPdfApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: {
        readonly light: "file:quickpdf.svg";
        readonly dark: "file:quickpdf.svg";
    };
    supportedNodes: string[];
    properties: INodeProperties[];
    authenticate: {
        type: "generic";
        properties: {
            headers: {
                Authorization: string;
            };
        };
    };
    test: ICredentialTestRequest;
}
