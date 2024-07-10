"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const schedule = require("node-schedule");
const actionhero_1 = require("actionhero");
class Scheduler extends actionhero_1.Initializer {
    constructor() {
        super();
        this.name = "scheduler";
    }
    initialize() {
        this.scheduledJobs = [];
    }
    start() {
        return; //no jobs!...
        console.log("starting schedule");
        // do this job every 10 seconds, cron style
        const job = schedule.scheduleJob("0,10,20,30,40,50 * * * * *", async () => {
            // we want to ensure that only one instance of this job is scheduled in our environment at once,
            // no matter how many schedulers we have running  
            // if (api.resque.scheduler && api.resque.scheduler.leader) {
            //   console.log("scheduledJob run...");
            //   await task.enqueue("sayHello", { wordToSay: "evan@actionherojs.com" });        
            // }
        });
        this.scheduledJobs.push(job);
    }
    stop() {
        this.scheduledJobs.forEach((job) => {
            job.cancel();
        });
    }
}
exports.Scheduler = Scheduler;
