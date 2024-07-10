"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelSdkViewData = exports.ModelSdkView = exports.ModelSdkList = exports.ModelSdk = void 0;
const actionhero_1 = require("actionhero");
const modelExtractor_1 = require("../../MendixSdk/modelExtractor");
const ExtractionJob_1 = require("../../models/ExtractionJob");
const crypto_1 = require("../../utils/crypto");
class ModelSdk extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = "modelsdk:extract";
        this.description = "extract model sdk metadata";
        this.inputs = {
            mendixToken: { required: true },
            appId: { required: true },
            branchName: { required: true },
            exportPages: { required: false, default: true },
            exportMicroflows: { required: false, default: true },
            exportNanoflows: { required: false, default: true },
            exportEntities: { required: false, default: true },
        };
    }
    async run({ params }) {
        const exportPages = Boolean(params.exportPages);
        const exportMicroflows = Boolean(params.exportMicroflows);
        const exportNanoflows = Boolean(params.exportNanoflows);
        const exportEntities = Boolean(params.exportEntities);
        const modelSdkExtractor = new modelExtractor_1.ModelSdkExtractor(params.mendixToken, params.appId, params.branchName, []);
        const valid = await modelSdkExtractor.validateAndGetBranch();
        //cria novo fila
        const job = new ExtractionJob_1.ExtractionJob({
            mendixToken: (0, crypto_1.encryptToken)(params.mendixToken),
            appId: params.appId,
            branchName: params.branchName,
            exportPages: exportPages,
            exportMicroflows: exportMicroflows,
            exportNanoflows: exportNanoflows,
            exportEntities: exportEntities,
            status: ExtractionJob_1.JobStatus.PENDENTE.valueOf(),
        });
        await job.save();
        //processa async em uma fila...
        await actionhero_1.task.enqueueIn(1000, "extractiontask", { jobId: job.jobId });
        var jobData = job.apiData();
        console.log(JSON.stringify(jobData));
        return { data: jobData };
    }
}
exports.ModelSdk = ModelSdk;
class ModelSdkList extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = "modelsdk:list";
        this.description = this.name;
        this.inputs = {
            limit: { required: false, default: 100 },
            offset: { required: false, default: 0 },
        };
    }
    async run({ params }) {
        const jobs = await ExtractionJob_1.ExtractionJob.findAll({
            limit: parseInt(params.limit) || 100,
            offset: parseInt(params.offset) || 0,
            subQuery: false,
            order: [["createdAt", "DESC"]],
        });
        return {
            data: jobs.map((u) => u.apiData()),
        };
    }
}
exports.ModelSdkList = ModelSdkList;
class ModelSdkView extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = "modelsdk:view";
        this.description = this.name;
        this.middleware = [];
        this.inputs = {
            jobId: { required: true },
        };
    }
    async run({ params }) {
        const job = await ExtractionJob_1.ExtractionJob.findOne({ where: { jobId: params.jobId } });
        if (!job) {
            throw new Error("job not found");
        }
        var jobData = job.apiData();
        //console.log(JSON.stringify(jobData));
        return { data: jobData };
    }
}
exports.ModelSdkView = ModelSdkView;
class ModelSdkViewData extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = "modelsdk:viewData";
        this.description = this.name;
        this.middleware = [];
        this.inputs = {
            jobId: { required: true },
        };
    }
    async run({ params }) {
        const job = await ExtractionJob_1.ExtractionJob.findOne({ where: { jobId: params.jobId } });
        if (!job) {
            throw new Error("job not found");
        }
        var jobData = JSON.parse(job.jsonResult);
        //console.log(JSON.stringify(jobData));
        return { data: jobData };
    }
}
exports.ModelSdkViewData = ModelSdkViewData;
