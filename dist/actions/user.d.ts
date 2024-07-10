import { Action, Connection, ParamsFrom } from "actionhero";
export declare class UserCreate extends Action {
    name: string;
    description: string;
    inputs: {
        firstName: {
            required: boolean;
        };
        lastName: {
            required: boolean;
        };
        password: {
            required: boolean;
        };
        email: {
            required: boolean;
        };
    };
    run({ params, connection }: {
        params: ParamsFrom<UserCreate>;
        connection: Connection;
    }): Promise<{
        userGuid: string;
        error?: undefined;
    } | {
        error: string;
        userGuid?: undefined;
    }>;
}
export declare class UserList extends Action {
    name: string;
    description: string;
    inputs: {};
    run({ params }: {
        params: ParamsFrom<UserList>;
    }): Promise<{
        data: any[];
    }>;
}
export declare class UserView extends Action {
    name: string;
    description: string;
    middleware: string[];
    inputs: {};
    run(data: any): Promise<{
        user: {
            guid: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    }>;
}
export declare class UserDelete extends Action {
    name: string;
    description: string;
    inputs: {
        userGuid: {
            required: boolean;
        };
    };
    middleware: string[];
    run({ params, connection }: {
        params: ParamsFrom<UserDelete>;
        connection: Connection;
    }): Promise<{
        error: string;
    }>;
}
