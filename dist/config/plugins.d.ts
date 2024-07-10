import { PluginConfig } from "actionhero";
declare const namespace = "plugins";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
    }
}
export declare const DEFAULT: {
    [namespace]: () => PluginConfig;
};
export {};
