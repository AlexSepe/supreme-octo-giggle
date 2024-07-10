import * as winston from "winston";
import { ActionheroConfigInterface } from "actionhero";
declare const namespace = "logger";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
    }
}
type ActionheroConfigLoggerBuilderArray = Array<(config: ActionheroConfigInterface) => winston.Logger>;
export declare const DEFAULT: {
    logger: (config: ActionheroConfigInterface) => {
        loggers: ActionheroConfigLoggerBuilderArray;
        maxLogStringLength: number;
        maxLogArrayLength: number;
    };
};
export declare const test: {
    logger: (config: ActionheroConfigInterface) => {
        loggers: ActionheroConfigLoggerBuilderArray;
    };
};
export {};
