import { ActionheroLogLevel } from "actionhero";
import { MultiWorker, Queue, Scheduler } from "node-resque";
declare const namespace = "tasks";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
    }
}
export declare const DEFAULT: {
    tasks: () => {
        _toExpand: boolean;
        scheduler: boolean;
        queues: string[] | (() => Promise<string[]>);
        workerLogging: {
            failure: ActionheroLogLevel;
            success: ActionheroLogLevel;
            start: ActionheroLogLevel;
            end: ActionheroLogLevel;
            cleaning_worker: ActionheroLogLevel;
            poll: ActionheroLogLevel;
            job: ActionheroLogLevel;
            pause: ActionheroLogLevel;
            reEnqueue: ActionheroLogLevel;
            internalError: ActionheroLogLevel;
            multiWorkerAction: ActionheroLogLevel;
        };
        schedulerLogging: {
            start: ActionheroLogLevel;
            end: ActionheroLogLevel;
            poll: ActionheroLogLevel;
            enqueue: ActionheroLogLevel;
            working_timestamp: ActionheroLogLevel;
            reEnqueue: ActionheroLogLevel;
            transferred_job: ActionheroLogLevel;
        };
        timeout: number;
        minTaskProcessors: number;
        maxTaskProcessors: number;
        checkTimeout: number;
        maxEventLoopDelay: number;
        stuckWorkerTimeout: number;
        retryStuckJobs: boolean;
        resque_overrides: {
            queue: Queue;
            multiWorker: MultiWorker;
            scheduler: Scheduler;
        };
        connectionOptions: {
            tasks: {};
        };
    };
};
export declare const test: {
    tasks: () => {
        timeout: number;
        checkTimeout: number;
    };
};
export {};
