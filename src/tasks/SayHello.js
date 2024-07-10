import { Task } from "actionhero";
import { log } from "actionhero";

export class SayHello extends Task {
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
    log(`Hello .. ${JSON.stringify(data)}`, "info");    
  }
}

