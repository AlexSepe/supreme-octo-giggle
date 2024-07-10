import { Action, RouteType } from "actionhero";
declare const responses: {
    200: {
        description: string;
    };
    400: {
        description: string;
    };
    404: {
        description: string;
    };
    422: {
        description: string;
    };
    500: {
        description: string;
    };
};
export declare class Swagger extends Action {
    name: string;
    description: string;
    outputExample: {};
    getLatestAction(route: RouteType): Action;
    buildSwaggerPaths(): {
        swaggerPaths: {
            [path: string]: {
                [method: string]: {
                    tags: string[];
                    summary: string;
                    consumes: string[];
                    produces: string[];
                    parameters: Array<{
                        in: string;
                        name: string;
                        type: string;
                        required: boolean;
                        default: string | number | boolean;
                    }>;
                    responses: typeof responses;
                    security: string[];
                };
            };
        };
        tags: string[];
    };
    run(): Promise<{
        swagger: string;
        info: {
            description: string;
            version: string;
            title: string;
            license: {
                name: string;
            };
        };
        host: string;
        basePath: string;
        schemes: string[];
        paths: {
            [path: string]: {
                [method: string]: {
                    tags: string[];
                    summary: string;
                    consumes: string[];
                    produces: string[];
                    parameters: Array<{
                        in: string;
                        name: string;
                        type: string;
                        required: boolean;
                        default: string | number | boolean;
                    }>;
                    responses: typeof responses;
                    security: string[];
                };
            };
        };
        securityDefinitions: {};
        externalDocs: {
            description: string;
            url: string;
        };
    }>;
}
export {};
