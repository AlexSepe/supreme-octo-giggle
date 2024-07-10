"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SayHello = void 0;
const actionhero_1 = require("actionhero");
const actionhero_2 = require("actionhero");
class SayHello extends actionhero_1.Task {
    constructor() {
        super();
        this.name = "sayHello";
        this.description = "I say hello";
        this.frequency = 0;
        this.queue = "high";
        this.middleware = [];
        this.inputs = {
            wordToSay: { required: false, default: "world" },
            teste2: { required: false, default: "world" }
        };
    }
    async run(data) {
        (0, actionhero_2.log)(`Hello .. ${JSON.stringify(data)}`, "info");
    }
}
exports.SayHello = SayHello;
