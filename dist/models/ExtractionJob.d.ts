import { Model } from "sequelize-typescript";
export declare enum JobStatus {
    PENDENTE = "PENDENTE",
    BAIXANDO_REPO = "BAIXANDO_REPO",
    PROCESSANDO = "PROCESSANDO",
    SUCESSO = "SUCESSO",
    ERRO = "ERRO"
}
export declare class ExtractionJob extends Model<ExtractionJob> {
    saltRounds: number;
    jobId: string;
    mendixToken: string;
    appId: string;
    branchName: string;
    exportPages: boolean;
    exportMicroflows: boolean;
    exportNanoflows: boolean;
    exportEntities: boolean;
    status: String;
    jsonResult: string;
    log: string;
    completedAt: Date;
    startedAt: Date;
    static generateGuid(instance: ExtractionJob): void;
    apiData(): {
        jobId: string;
        appId: string;
        branchName: string;
        exportPages: boolean;
        exportMicroflows: boolean;
        exportNanoflows: boolean;
        exportEntities: boolean;
        status: String;
        log: string;
        createdAt: any;
        startedAt: Date;
        completedAt: Date;
    };
}
