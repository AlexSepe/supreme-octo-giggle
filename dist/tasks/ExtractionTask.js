"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractionTask = void 0;
const actionhero_1 = require("actionhero");
const actionhero_2 = require("actionhero");
const modelExtractor_1 = require("../MendixSdk/modelExtractor");
const ExtractionJob_1 = require("../models/ExtractionJob");
const crypto_1 = require("../utils/crypto");
class ExtractionTask extends actionhero_1.Task {
    constructor() {
        super();
        this.name = "extractiontask";
        this.description = "Mendix Sdk Extraction Task";
        this.frequency = 0;
        this.queue = "high";
        this.middleware = [];
        this.inputs = {
            jobId: { required: true },
        };
    }
    async run(params) {
        (0, actionhero_2.log)(`Processando .. ${JSON.stringify(params)}`, "info");
        const job = await ExtractionJob_1.ExtractionJob.findOne({ where: { jobId: params.jobId } });
        if (!job) {
            throw new Error('job not found');
        }
        let contentToExport = [];
        if (job.exportPages) {
            contentToExport.push(modelExtractor_1.ExportableContent.PAGES);
        }
        ;
        if (job.exportMicroflows) {
            contentToExport.push(modelExtractor_1.ExportableContent.MICROFLOWS);
        }
        ;
        if (job.exportNanoflows) {
            contentToExport.push(modelExtractor_1.ExportableContent.NANOFLOWS);
        }
        ;
        if (job.exportEntities) {
            contentToExport.push(modelExtractor_1.ExportableContent.ENTITIES);
        }
        ;
        try {
            job.startedAt = new Date();
            await job.save();
            //***01 */
            const modelSdkExtractor = new modelExtractor_1.ModelSdkExtractor((0, crypto_1.decryptToken)(job.mendixToken), job.appId, job.branchName, contentToExport);
            job.status = ExtractionJob_1.JobStatus.BAIXANDO_REPO.valueOf();
            await job.save();
            //***02 */
            const branch = await modelSdkExtractor.validateAndGetBranch();
            const workingCopy = await modelSdkExtractor.loadWorkingCopy(branch.name);
            job.status = ExtractionJob_1.JobStatus.PROCESSANDO.valueOf();
            await job.save();
            //***03 */
            const jsonData = await modelSdkExtractor.extractModel(workingCopy, branch);
            job.jsonResult = JSON.stringify(jsonData);
            job.status = ExtractionJob_1.JobStatus.SUCESSO.valueOf();
            job.completedAt = new Date();
            await job.save();
            //log(`Processado .. ${JSON.stringify(job)}`, "info");   
        }
        catch (error) {
            let errorMsg;
            if (error instanceof Error)
                errorMsg = error.message;
            else
                errorMsg = String(error);
            console.error(error);
            console.error("Msg: " + errorMsg);
            job.status = ExtractionJob_1.JobStatus.ERRO.valueOf();
            job.log = errorMsg;
            job.completedAt = new Date();
            await job.save();
            //throw error;
        }
    }
}
exports.ExtractionTask = ExtractionTask;
