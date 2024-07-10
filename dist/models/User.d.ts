import { Model } from "sequelize-typescript";
export declare class User extends Model<User> {
    saltRounds: number;
    guid: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    static generateGuid(instance: User): void;
    updatePassword(password: string): Promise<void>;
    checkPassword(password: string): Promise<boolean>;
    apiData(): {
        guid: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}
