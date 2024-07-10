"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
const actionhero_1 = require("actionhero");
const path = require("path");
const fs = require("fs");
// These values are probably good starting points, but you should expect to tweak them for your application
const maxMemoryAlloted = process.env.maxMemoryAlloted
    ? parseInt(process.env.maxMemoryAlloted)
    : 500;
const maxResqueQueueLength = process.env.maxResqueQueueLength
    ? parseInt(process.env.maxResqueQueueLength)
    : 1000;
var StatusMessages;
(function (StatusMessages) {
    StatusMessages["healthy"] = "Node Healthy";
    StatusMessages["unhealthy"] = "Node Unhealthy";
})(StatusMessages || (StatusMessages = {}));
const packageJSON = JSON.parse(fs
    .readFileSync(path.normalize(path.join(__dirname, "..", "..", "package.json")))
    .toString());
class Status extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = "status";
        this.description = "I will return some basic information about the API";
        this.outputExample = {
            id: "192.168.2.11",
            actionheroVersion: "9.4.1",
            uptime: 10469,
        };
    }
    async run() {
        let nodeStatus = StatusMessages.healthy;
        const problems = [];
        const consumedMemoryMB = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
        if (consumedMemoryMB > maxMemoryAlloted) {
            nodeStatus = StatusMessages.unhealthy;
            problems.push(`Using more than ${maxMemoryAlloted} MB of RAM/HEAP`);
        }
        let resqueTotalQueueLength = 0;
        const details = await actionhero_1.task.details();
        let length = 0;
        Object.keys(details.queues).forEach((q) => {
            length += details.queues[q].length;
        });
        resqueTotalQueueLength = length;
        if (length > maxResqueQueueLength) {
            nodeStatus = StatusMessages.unhealthy;
            problems.push(`Resque Queues over ${maxResqueQueueLength} jobs`);
        }
        return {
            id: actionhero_1.id,
            actionheroVersion: actionhero_1.actionheroVersion,
            name: packageJSON.name,
            description: packageJSON.description,
            version: packageJSON.version,
            uptime: new Date().getTime() - actionhero_1.api.bootTime,
            consumedMemoryMB,
            resqueTotalQueueLength,
            nodeStatus,
            problems,
        };
    }
}
exports.Status = Status;
