import { RoutesConfig } from "actionhero";
declare const namespace = "routes";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
    }
}
export declare const DEFAULT: {
    [namespace]: () => RoutesConfig;
};
export {};
