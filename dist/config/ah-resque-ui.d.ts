declare const namespace = "ah-resque-ui";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<typeof DEFAULT[typeof namespace]>;
    }
}
export declare const DEFAULT: {
    "ah-resque-ui": () => {
        middleware: any;
    };
};
export {};
