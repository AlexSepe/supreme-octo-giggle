export = SessionInitializer;
declare class SessionInitializer extends Initializer {
    initialize(): Promise<void>;
}
import { Initializer } from "actionhero";
