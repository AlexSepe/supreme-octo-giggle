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
exports.ExtractionJob = exports.JobStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const crypto_1 = require("crypto");
var JobStatus;
(function (JobStatus) {
    JobStatus["PENDENTE"] = "PENDENTE";
    JobStatus["BAIXANDO_REPO"] = "BAIXANDO_REPO";
    JobStatus["PROCESSANDO"] = "PROCESSANDO";
    JobStatus["SUCESSO"] = "SUCESSO";
    JobStatus["ERRO"] = "ERRO";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
let ExtractionJob = class ExtractionJob extends sequelize_typescript_1.Model {
    constructor() {
        super(...arguments);
        this.saltRounds = 10;
    }
    static generateGuid(instance) {
        if (!instance.jobId) {
            instance.jobId = (0, crypto_1.randomUUID)();
        }
    }
    apiData() {
        return {
            jobId: this.jobId,
            appId: this.appId,
            branchName: this.branchName,
            exportPages: this.exportPages,
            exportMicroflows: this.exportMicroflows,
            exportNanoflows: this.exportNanoflows,
            exportEntities: this.exportEntities,
            status: this.status,
            log: this.log,
            createdAt: this.createdAt,
            startedAt: this.startedAt,
            completedAt: this.completedAt,
        };
    }
};
exports.ExtractionJob = ExtractionJob;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true }),
    __metadata("design:type", String)
], ExtractionJob.prototype, "jobId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ExtractionJob.prototype, "mendixToken", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ExtractionJob.prototype, "appId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ExtractionJob.prototype, "branchName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ExtractionJob.prototype, "exportPages", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ExtractionJob.prototype, "exportMicroflows", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ExtractionJob.prototype, "exportNanoflows", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ExtractionJob.prototype, "exportEntities", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ExtractionJob.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ExtractionJob.prototype, "jsonResult", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ExtractionJob.prototype, "log", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], ExtractionJob.prototype, "completedAt", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], ExtractionJob.prototype, "startedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExtractionJob]),
    __metadata("design:returntype", void 0)
], ExtractionJob, "generateGuid", null);
exports.ExtractionJob = ExtractionJob = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "extractionjob", paranoid: true })
], ExtractionJob);
