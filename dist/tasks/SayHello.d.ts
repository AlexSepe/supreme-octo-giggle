export class SayHello extends Task {
    frequency: number;
    middleware: any[];
    inputs: {
        wordToSay: {
            required: boolean;
            default: string;
        };
        teste2: {
            required: boolean;
            default: string;
        };
    };
    run(data: any): Promise<void>;
}
import { Task } from "actionhero";
