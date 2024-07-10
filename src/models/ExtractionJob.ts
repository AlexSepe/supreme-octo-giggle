import {
  Model,
  Table,
  Column,
  AllowNull,  
  BeforeCreate,
  HasMany,
  Default,
} from "sequelize-typescript";
import { randomUUID } from "crypto";
import { Integer } from "type-fest";

export enum JobStatus {
  PENDENTE = "PENDENTE",
  BAIXANDO_REPO = "BAIXANDO_REPO",
  PROCESSANDO = "PROCESSANDO",
  SUCESSO = "SUCESSO",
  ERRO = "ERRO"
}

@Table({ tableName: "extractionjob", paranoid: true })
export class ExtractionJob extends Model<ExtractionJob> {
  saltRounds = 10;

  @Column({ primaryKey: true })
  jobId: string;

  @AllowNull(false)
  @Column
  mendixToken: string;
  @AllowNull(false)
  @Column
  appId: string;
  @AllowNull(false)  
  @Column
  branchName: string;

  @Column
  exportPages: boolean;
  @Column
  exportMicroflows: boolean;
  @Column
  exportNanoflows: boolean;
  @Column
  exportEntities: boolean;
  
  @Column  
  status: String;
  @Column
  jsonResult: string;
  @Column
  log: string;

  @Column
  completedAt: Date;
  @Column
  startedAt: Date;

  @BeforeCreate
  static generateGuid(instance: ExtractionJob) {
    if (!instance.jobId) {
      instance.jobId = randomUUID();
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
    }
  }
}