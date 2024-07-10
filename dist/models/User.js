"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcrypt = require("bcrypt");
const sequelize_typescript_1 = require("sequelize-typescript");
const crypto_1 = require("crypto");
let User = class User extends sequelize_typescript_1.Model {
    constructor() {
        super(...arguments);
        this.saltRounds = 10;
    }
    static generateGuid(instance) {
        if (!instance.guid) {
            instance.guid = (0, crypto_1.randomUUID)();
        }
    }
    async updatePassword(password) {
        this.passwordHash = await bcrypt.hash(password, this.saltRounds);
        await this.save();
    }
    async checkPassword(password) {
        if (!this.passwordHash) {
            throw new Error("password not set for this team member");
        }
        const match = await bcrypt.compare(password, this.passwordHash);
        return match;
    }
    apiData() {
        return {
            guid: this.guid,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName
        };
    }
};
exports.User = User;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true }),
    __metadata("design:type", String)
], User.prototype, "guid", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.IsEmail,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", void 0)
], User, "generateGuid", null);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "users", paranoid: true })
], User);
