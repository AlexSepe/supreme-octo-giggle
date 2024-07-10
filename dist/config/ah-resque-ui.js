"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT = void 0;
const namespace = "ah-resque-ui";
exports.DEFAULT = {
    [namespace]: () => {
        return {
            // the name of the middleware(s) which will protect all actions in this plugin
            // ie middleware: ['logged-in-session', 'role-admin']
            //["basic-auth"] as string[],
            middleware: null, // ["basic-auth"] as string[], 
        };
    },
};
