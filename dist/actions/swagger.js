"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swagger = void 0;
const actionhero_1 = require("actionhero");
const fs = require("fs");
const path = require("path");
const SWAGGER_VERSION = "2.0";
const API_VERSION = ""; // if you need a prefix to your API routes, like `v1`
const parentPackageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "package.json")).toString());
const responses = {
    200: {
        description: "successful operation",
    },
    400: {
        description: "Invalid input",
    },
    404: {
        description: "Not Found",
    },
    422: {
        description: "Missing or invalid params",
    },
    500: {
        description: "Server error",
    },
};
class Swagger extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = "swagger";
        this.description = "return API documentation in the OpenAPI specification";
        this.outputExample = {};
    }
    getLatestAction(route) {
        let matchedAction;
        Object.keys(actionhero_1.api.actions.actions).forEach((actionName) => {
            Object.keys(actionhero_1.api.actions.actions[actionName]).forEach((version) => {
                const action = actionhero_1.api.actions.actions[actionName][version];
                if (action.name === route.action) {
                    matchedAction = action;
                }
            });
        });
        return matchedAction;
    }
    buildSwaggerPaths() {
        const swaggerPaths = {};
        const tags = [];
        for (const [method, routes] of Object.entries(actionhero_1.api.routes.routes)) {
            routes.map((route) => {
                const action = this.getLatestAction(route);
                if (!action)
                    return;
                const tag = action.name.split(":")[0];
                const formattedPath = route.path
                    .replace("/v:apiVersion", "")
                    .replace(/\/:(\w*)/g, "/{$1}");
                swaggerPaths[formattedPath] = swaggerPaths[formattedPath] || {};
                swaggerPaths[formattedPath][method] = {
                    tags: [tag],
                    summary: action.description,
                    // description: action.description, // this is redundant
                    consumes: ["application/json"],
                    produces: ["application/json"],
                    parameters: Object.keys(action.inputs)
                        .sort()
                        .map((inputName) => {
                        return {
                            in: route.path.includes(`:${inputName}`) ? "path" : "query",
                            name: inputName,
                            type: "string", // not really true, but helps the swagger validator
                            required: action.inputs[inputName].required ||
                                route.path.includes(`:${inputName}`)
                                ? true
                                : false,
                            default: action.inputs[inputName].default !== null &&
                                action.inputs[inputName].default !== undefined
                                ? typeof action.inputs[inputName].default === "object"
                                    ? JSON.stringify(action.inputs[inputName].default)
                                    : typeof action.inputs[inputName].default === "function"
                                        ? action.inputs[inputName].default()
                                        : `${action.inputs[inputName].default}`
                                : undefined,
                        };
                    }),
                    responses,
                    security: [],
                };
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        }
        return { swaggerPaths, tags };
    }
    async run() {
        var _a, _b;
        const { swaggerPaths, tags } = this.buildSwaggerPaths();
        return {
            swagger: SWAGGER_VERSION,
            info: {
                description: parentPackageJSON.description,
                version: parentPackageJSON.version,
                title: parentPackageJSON.name,
                license: { name: parentPackageJSON.license },
            },
            host: (_b = (_a = actionhero_1.config.web.allowedRequestHosts[0]) === null || _a === void 0 ? void 0 : _a.replace("https://", "").replace("https://", "")) !== null && _b !== void 0 ? _b : `localhost:${actionhero_1.config.web.port}`,
            basePath: `/api/${API_VERSION}`,
            // tags: tags.map((tag) => {
            //   return { name: tag, description: `topic: ${tag}` };
            // }),
            schemes: actionhero_1.config.web.allowedRequestHosts[0] ? ["https", "http"] : ["http"],
            paths: swaggerPaths,
            securityDefinitions: {
            // TODO (custom)?
            },
            externalDocs: {
                description: "Learn more about Actionhero",
                url: "https://www.actionherojs.com",
            },
        };
    }
}
exports.Swagger = Swagger;
