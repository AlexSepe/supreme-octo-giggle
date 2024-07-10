import { ActionheroLogLevel } from "actionhero";
declare const namespace = "general";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
    }
}
export declare const DEFAULT: {
    general: () => {
        apiVersion: string;
        serverName: string;
        id: string;
        welcomeMessage: string;
        serverToken: string;
        cachePrefix: string;
        lockPrefix: string;
        lockDuration: number;
        simultaneousActions: number;
        enforceConnectionProperties: boolean;
        disableParamScrubbing: boolean;
        enableResponseLogging: boolean;
        filteredParams: string[] | (() => string[]);
        filteredResponse: string[] | (() => string[]);
        missingParamChecks: string[];
        directoryFileType: string;
        fileRequestLogLevel: ActionheroLogLevel;
        defaultMiddlewarePriority: number;
        channel: string;
        rpcTimeout: number;
        cliIncludeInternal: boolean;
        paths: {
            action: string[];
            task: string[];
            server: string[];
            cli: string[];
            initializer: string[];
            public: string[];
            pid: string[];
            log: string[];
            plugin: string[];
            test: string[];
            src: string;
            dist: string;
        };
        startingChatRooms: Record<string, Record<string, any>>;
    };
};
export declare const test: {
    general: () => {
        serverToken: string;
        startingChatRooms: {
            defaultRoom: {};
            otherRoom: {};
        };
        rpcTimeout: number;
    };
};
export declare const production: {
    general: () => {
        fileRequestLogLevel: string;
    };
};
export {};
