declare const namespace = "redis";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
    }
}
/**
 * This is the standard redis config for Actionhero.
 * This will use a redis server to persist cache, share chat message between processes, etc.
 */
export declare const DEFAULT: {
    redis: () => {
        scanCount: number;
        stopTimeout: number;
        _toExpand: boolean;
        client: {
            konstructor: any;
            args: {
                port: string | number;
                host: string;
                password: string;
                db: number;
                tls: {
                    rejectUnauthorized: boolean;
                };
                retryStrategy: (times: number) => number;
            }[];
            buildNew: boolean;
        };
        subscriber: {
            konstructor: any;
            args: {
                port: string | number;
                host: string;
                password: string;
                db: number;
                tls: {
                    rejectUnauthorized: boolean;
                };
                retryStrategy: (times: number) => number;
            }[];
            buildNew: boolean;
        };
        tasks: {
            konstructor: any;
            args: {
                port: string | number;
                host: string;
                password: string;
                db: number;
                tls: {
                    rejectUnauthorized: boolean;
                };
                retryStrategy: (times: number) => number;
            }[];
            buildNew: boolean;
        };
    };
};
export {};
