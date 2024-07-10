"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.DEFAULT = void 0;
const namespace = "tasks";
exports.DEFAULT = {
    [namespace]: () => {
        return {
            _toExpand: false,
            // Should this node run a scheduler to promote delayed tasks?
            scheduler: true,
            // what queues should the taskProcessors work?
            queues: ["*"],
            // Or, rather than providing a static list of `queues`, you can define a method that returns the list of queues.
            // queues: async () => { return ["queueA", "queueB"]; } as string[] | (() => Promise<string[]>)>,
            // Logging levels of task workers
            workerLogging: {
                failure: "error", // task failure
                success: "info", // task success
                start: "info",
                end: "info",
                cleaning_worker: "info",
                poll: "debug",
                job: "debug",
                pause: "debug",
                reEnqueue: "debug",
                internalError: "error",
                multiWorkerAction: "debug",
            },
            // Logging levels of the task scheduler
            schedulerLogging: {
                start: "info",
                end: "info",
                poll: "debug",
                enqueue: "debug",
                working_timestamp: "debug",
                reEnqueue: "debug",
                transferred_job: "debug",
            },
            // how long to sleep between jobs / scheduler checks
            timeout: 5000,
            // at minimum, how many parallel taskProcessors should this node spawn?
            // (have number > 0 to enable, and < 1 to disable)
            minTaskProcessors: 2,
            // at maximum, how many parallel taskProcessors should this node spawn?
            maxTaskProcessors: 2,
            // how often should we check the event loop to spawn more taskProcessors?
            checkTimeout: 500,
            // how many ms would constitute an event loop delay to halt taskProcessors spawning?
            maxEventLoopDelay: 5,
            // how long before we mark a resque worker / task processor as stuck/dead?
            stuckWorkerTimeout: 1000 * 60 * 60,
            // should the scheduler automatically try to retry failed tasks which were failed due to being 'stuck'?
            retryStuckJobs: false,
            // Customize Resque primitives, replace null with required replacement.
            resque_overrides: {
                queue: null,
                multiWorker: null,
                scheduler: null,
            },
            connectionOptions: {
                tasks: {},
            },
        };
    },
};
exports.test = {
    [namespace]: () => {
        return {
            timeout: 100,
            checkTimeout: 50,
        };
    },
};
