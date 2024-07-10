import { ActionheroConfigInterface } from "actionhero";
declare const namespace = "websocket";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
    }
}
export declare const DEFAULT: {
    websocket: (config: ActionheroConfigInterface) => {
        enabled: boolean;
        clientUrl: string;
        clientJsPath: string;
        clientJsName: string;
        destroyClientsOnShutdown: boolean;
        server: {};
        client: {
            apiPath: string;
            cookieKey: string;
        };
    };
};
export {};
