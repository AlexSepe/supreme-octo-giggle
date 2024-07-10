"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT = void 0;
const namespace = "routes";
exports.DEFAULT = {
    [namespace]: () => {
        return {
            get: [
                { path: "/status", action: "status" },
                { path: "/swagger", action: "swagger" },
                { path: '/users', action: 'user:list' },
                { path: '/user', action: 'user:view' },
                { path: '/modelsdk/jobs/limit/:limit/offset/:offset', action: 'modelsdk:list' },
                { path: '/modelsdk/jobs', action: 'modelsdk:list' },
                { path: '/modelsdk/:jobId', action: 'modelsdk:view' },
                { path: '/modelsdk/:jobId/data', action: 'modelsdk:viewData' },
            ],
            post: [
                { path: '/session', action: 'session:create' },
                { path: '/user', action: 'user:create' }, // (POST) /user
                { path: '/modelsdk/extract', action: 'modelsdk:extract' },
            ],
            put: [
                { path: '/session', action: 'session:check' },
                { path: '/user', action: 'user:edit' }
            ],
            delete: [
                { path: '/session', action: 'session:destroy' },
                { path: '/user/:userId', action: 'user:delete' } // (POST) /user/:userId
            ],
            /* ---------------------
            For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
            If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.
      
            Learn more here: https://www.actionherojs.com/tutorials/web-server#Routes
      
            examples:
      
            get: [
              { path: '/users', action: 'usersList' }, // (GET) /api/users
              { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
            ],
      
            post: [
              { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
            ],
      
            all: [
              { path: '/user/:userID', action: 'user', matchTrailingPathParts: true } // (*) /api/user/123, api/user/123/stuff
            ]
      
            ---------------------- */
        };
    },
};
