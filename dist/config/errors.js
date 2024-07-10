"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT = void 0;
const namespace = "errors";
exports.DEFAULT = {
    [namespace]: () => {
        return {
            _toExpand: false,
            // Should error types of "unknownAction" be included to the Exception handlers?
            reportUnknownActions: false,
            // ///////////////
            // SERIALIZERS //
            // ///////////////
            serializers: {
                servers: {
                    web: (error) => {
                        if (error.message) {
                            return String(error.message);
                        }
                        else {
                            return error;
                        }
                    },
                    websocket: (error) => {
                        if (error.message) {
                            return String(error.message);
                        }
                        else {
                            return error;
                        }
                    },
                    specHelper: (error) => {
                        if (error.message) {
                            return "Error: " + String(error.message);
                        }
                        else {
                            return error;
                        }
                    },
                },
                // See ActionProcessor#applyDefaultErrorLogLineFormat to see an example of how to customize
                actionProcessor: null,
            },
            // ///////////
            // ACTIONS //
            // ///////////
            // When a params for an action is invalid
            invalidParams: (data, validationErrors) => {
                if (validationErrors.length >= 0)
                    return validationErrors[0];
                return "validation error";
            },
            // When a required param for an action is not provided
            missingParams: (data, missingParams) => {
                return `${missingParams[0]} is a required parameter for this action`;
            },
            // user requested an unknown action
            unknownAction: (data) => {
                return `unknown action or invalid apiVersion`;
            },
            // action not useable by this client/server type
            unsupportedServerType: (data) => {
                return `this action does not support the ${data.connection.type} connection type`;
            },
            // action failed because server is mid-shutdown
            serverShuttingDown: (data) => {
                return `the server is shutting down`;
            },
            // action failed because this client already has too many pending actions
            // limit defined in api.config.general.simultaneousActions
            tooManyPendingActions: (data) => {
                return `you have too many pending requests`;
            },
            // Decorate your response based on Error here.
            // Any action that throws an Error will pass through this method before returning
            //   an error to the client. Response can be edited here, status codes changed, etc.
            async genericError(data, error) {
                return error;
            },
            // ///////////////
            // FILE SERVER //
            // ///////////////
            // The body message to accompany 404 (file not found) errors regarding flat files
            // You may want to load in the content of 404.html or similar
            fileNotFound: (connection) => {
                return `that file is not found`;
            },
            // user didn't request a file
            fileNotProvided: (connection) => {
                return `file is a required param to send a file`;
            },
            // something went wrong trying to read the file
            fileReadError: (connection, error) => {
                var _a;
                return `error reading file: ${(_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error}`;
            },
            // ///////////////
            // CONNECTIONS //
            // ///////////////
            verbNotFound: (connection, verb) => {
                return `verb not found or not allowed (${verb})`;
            },
            verbNotAllowed: (connection, verb) => {
                return `verb not found or not allowed (${verb})`;
            },
            connectionRoomAndMessage: (connection) => {
                return `both room and message are required`;
            },
            connectionNotInRoom: (connection, room) => {
                return `connection not in this room (${room})`;
            },
            connectionAlreadyInRoom: (connection, room) => {
                return `connection already in this room (${room})`;
            },
            connectionRoomHasBeenDeleted: (room) => {
                return "this room has been deleted";
            },
            connectionRoomNotExist: (room) => {
                return "room does not exist";
            },
            connectionRoomExists: (room) => {
                return "room exists";
            },
            connectionRoomRequired: () => {
                return "a room is required";
            },
        };
    },
};
