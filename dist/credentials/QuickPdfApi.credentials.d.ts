import type { ICredentialType, INodeProperties } from "n8n-workflow";
export declare class QuickPdfApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate: {
        type: "generic";
        properties: {
            headers: {
                Authorization: string;
            };
        };
    };
}
