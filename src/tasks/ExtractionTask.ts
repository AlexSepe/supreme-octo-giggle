import { ParamsFrom, Task } from "actionhero";
import { log } from "actionhero";
import { ExportableContent, ModelSdkExtractor} from "../MendixSdk/modelExtractor";
import { ExtractionJob, JobStatus } from "../models/ExtractionJob";
import { decryptToken } from "../utils/crypto";

export class ExtractionTask extends Task {
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
    log(`Processando .. ${JSON.stringify(params)}`, "info");   

    const job = await ExtractionJob.findOne({ where: { jobId: params.jobId } })
    if (!job) { throw new Error('job not found') }

    let contentToExport: ExportableContent[] = [];
    if (job.exportPages) {contentToExport.push(ExportableContent.PAGES)};
    if (job.exportMicroflows) {contentToExport.push(ExportableContent.MICROFLOWS)};
    if (job.exportNanoflows) {contentToExport.push(ExportableContent.NANOFLOWS)};
    if (job.exportEntities) {contentToExport.push(ExportableContent.ENTITIES)};

    try {          
      job.startedAt = new Date();      
      await job.save();       
      //***01 */
      const modelSdkExtractor = new ModelSdkExtractor(decryptToken(job.mendixToken), job.appId, job.branchName, contentToExport);

      job.status = JobStatus.BAIXANDO_REPO.valueOf();
      await job.save(); 
      //***02 */
      const branch = await modelSdkExtractor.validateAndGetBranch();            
      const workingCopy = await modelSdkExtractor.loadWorkingCopy(branch.name);        

      job.status = JobStatus.PROCESSANDO.valueOf();
      await job.save();  
      //***03 */
      const jsonData = await modelSdkExtractor.extractModel(workingCopy, branch);       
          
      job.jsonResult = JSON.stringify(jsonData);
      job.status = JobStatus.SUCESSO.valueOf();
      job.completedAt = new Date();
      await job.save();  


      //log(`Processado .. ${JSON.stringify(job)}`, "info");   

    } catch (error) {
      let errorMsg;
      if (error instanceof Error) errorMsg = error.message
      else errorMsg = String(error)
      
      console.error(error); 
                 
      console.error("Msg: " + errorMsg); 

      job.status = JobStatus.ERRO.valueOf();
      job.log = errorMsg;
      job.completedAt = new Date();
      await job.save();  

      //throw error;
    }
    
  }
}

