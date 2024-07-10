import { ActionProcessor, Connection } from "actionhero";
declare const namespace = "errors";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
    }
}
export declare const DEFAULT: {
    errors: () => {
        _toExpand: boolean;
        reportUnknownActions: boolean;
        serializers: {
            servers: {
                web: (error: NodeJS.ErrnoException) => string | NodeJS.ErrnoException;
                websocket: (error: NodeJS.ErrnoException) => string | NodeJS.ErrnoException;
                specHelper: (error: NodeJS.ErrnoException) => string | NodeJS.ErrnoException;
            };
            actionProcessor: ActionProcessor<any>["applyDefaultErrorLogLineFormat"];
        };
        invalidParams: (data: ActionProcessor<any>, validationErrors: Array<string | Error>) => string | Error;
        missingParams: (data: ActionProcessor<any>, missingParams: string[]) => string;
        unknownAction: (data: ActionProcessor<any>) => string;
        unsupportedServerType: (data: ActionProcessor<any>) => string;
        serverShuttingDown: (data: ActionProcessor<any>) => string;
        tooManyPendingActions: (data: ActionProcessor<any>) => string;
        genericError(data: ActionProcessor<any>, error: NodeJS.ErrnoException): Promise<NodeJS.ErrnoException>;
        fileNotFound: (connection: Connection) => string;
        fileNotProvided: (connection: Connection) => string;
        fileReadError: (connection: Connection, error: NodeJS.ErrnoException) => string;
        verbNotFound: (connection: Connection, verb: string) => string;
        verbNotAllowed: (connection: Connection, verb: string) => string;
        connectionRoomAndMessage: (connection: Connection) => string;
        connectionNotInRoom: (connection: Connection, room: string) => string;
        connectionAlreadyInRoom: (connection: Connection, room: string) => string;
        connectionRoomHasBeenDeleted: (room: string) => string;
        connectionRoomNotExist: (room: string) => string;
        connectionRoomExists: (room: string) => string;
        connectionRoomRequired: () => string;
    };
};
export {};
