import { Dialect } from "sequelize";
import 'dotenv/config';
declare const namespace = "sequelize";
declare module "actionhero" {
    interface ActionheroConfigInterface {
        [namespace]: ReturnType<typeof DEFAULT[typeof namespace]>;
    }
}
export declare const DEFAULT: {
    sequelize: (config: Record<string, any>) => {
        autoMigrate: boolean;
        logging: boolean;
        dialect: Dialect;
        port: number;
        database: string;
        host: string;
        username: string;
        password: string;
        models: string[];
        migrations: string[];
        migrationLogLevel: string;
    };
};
export {};
