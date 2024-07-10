import { ActionheroConfigInterface } from "actionhero";
import type { Options as FormParserOptions } from "formidable";
declare const namespace = "web";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
    }
}
export declare const DEFAULT: {
    web: (config: ActionheroConfigInterface) => {
        enabled: boolean;
        secure: boolean;
        serverOptions: {};
        allowedRequestHosts: string[];
        port: string | number;
        bindIP: string;
        httpHeaders: {
            "X-Powered-By": string;
            "Access-Control-Allow-Origin": string;
            "Access-Control-Allow-Methods": string;
            "Access-Control-Allow-Headers": string;
            "Strict-Transport-Security": string;
        };
        urlPathForActions: string;
        urlPathForFiles: string;
        rootEndpointType: string;
        automaticRoutes: string[];
        defaultErrorStatusCode: number;
        flatFileCacheDuration: number;
        enableEtag: boolean;
        saveRawBody: boolean;
        bootAttempts: number;
        fingerprintOptions: {
            cookieKey: string;
            toSetCookie: boolean;
            onlyStaticElements: boolean;
            settings: {
                path: string;
                expires: number;
            };
        };
        formOptions: FormParserOptions;
        padding: number;
        metadataOptions: {
            serverInformation: boolean;
            requesterInformation: boolean;
        };
        returnErrorCodes: boolean;
        compress: boolean;
        queryParseOptions: {};
    };
};
export declare const production: {
    web: () => {
        padding: number;
        metadataOptions: {
            serverInformation: boolean;
            requesterInformation: boolean;
        };
    };
};
export declare const test: {
    web: () => {
        secure: boolean;
        port: string | number;
        matchExtensionMime: boolean;
        metadataOptions: {
            serverInformation: boolean;
            requesterInformation: boolean;
        };
    };
};
export {};
