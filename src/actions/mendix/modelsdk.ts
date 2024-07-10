import { Action, Connection, ParamsFrom, log, task } from "actionhero";
import { ExportableContent, ModelSdkExtractor } from "../../MendixSdk/modelExtractor";
import { ExtractionJob, JobStatus } from "../../models/ExtractionJob";
import { encryptToken } from "../../utils/crypto";

export class ModelSdk extends Action {
  name = "modelsdk:extract";
  description = "extract model sdk metadata";
  inputs = {
    mendixToken: { required: true },
    appId: { required: true },
    branchName: { required: true },
    exportPages: { required: false, default: true },
    exportMicroflows: { required: false, default: true },
    exportNanoflows: { required: false, default: true },
    exportEntities: { required: false, default: true },
  };

  async run({ params }: { params: ParamsFrom<ModelSdk> }) {
    const exportPages = Boolean(params.exportPages);
    const exportMicroflows = Boolean(params.exportMicroflows);
    const exportNanoflows = Boolean(params.exportNanoflows);
    const exportEntities = Boolean(params.exportEntities);

    const modelSdkExtractor = new ModelSdkExtractor(params.mendixToken, params.appId, params.branchName, []);
    const valid = await modelSdkExtractor.validateAndGetBranch();

    //cria novo fila
    const job = new ExtractionJob({
      mendixToken: encryptToken(params.mendixToken),
      appId: params.appId,
      branchName: params.branchName,
      exportPages: exportPages,
      exportMicroflows: exportMicroflows,
      exportNanoflows: exportNanoflows,
      exportEntities: exportEntities,
      status: JobStatus.PENDENTE.valueOf(),
    });
    await job.save();

    //processa async em uma fila...
    await task.enqueueIn(1000, "extractiontask", { jobId: job.jobId });

    var jobData = job.apiData();
    console.log(JSON.stringify(jobData));
    return { data: jobData };
  }
}

export class ModelSdkList extends Action {
  name = "modelsdk:list";
  description = this.name;
  inputs = {
    limit: { required: false, default: 100 },
    offset: { required: false, default: 0 },
  };

  async run({ params }: { params: ParamsFrom<ModelSdkList> }) {
    const jobs = await ExtractionJob.findAll({
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

export class ModelSdkView extends Action {
  name = "modelsdk:view";
  description = this.name;
  middleware = [];
  inputs = {
    jobId: { required: true },
  };

  async run({ params }: { params: ParamsFrom<ModelSdkView> }) {
    const job = await ExtractionJob.findOne({ where: { jobId: params.jobId } });
    if (!job) {
      throw new Error("job not found");
    }

    var jobData = job.apiData();
    //console.log(JSON.stringify(jobData));
    return { data: jobData };
  }
}

export class ModelSdkViewData extends Action {
  name = "modelsdk:viewData";
  description = this.name;
  middleware = [];
  inputs = {
    jobId: { required: true },
  };

  async run({ params }: { params: ParamsFrom<ModelSdkView> }) {
    const job = await ExtractionJob.findOne({ where: { jobId: params.jobId } });
    if (!job) {
      throw new Error("job not found");
    }

    var jobData = JSON.parse(job.jsonResult);
    //console.log(JSON.stringify(jobData));
    return { data: jobData };
  }
}
