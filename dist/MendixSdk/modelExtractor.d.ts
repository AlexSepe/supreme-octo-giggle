import { MendixPlatformClient, OnlineWorkingCopy, App, IBranch } from "mendixplatformsdk";
import { IModel, projects, domainmodels, microflows, pages, security } from "mendixmodelsdk";
import { ModuleRoleModel, JsonData } from "./jsonData";
export declare enum ExportableContent {
    PAGES = 0,
    ENTITIES = 1,
    MICROFLOWS = 2,
    NANOFLOWS = 3
}
export declare class ModelSdkExtractor {
    app: App;
    client: MendixPlatformClient;
    branchName: string;
    mendixToken: string;
    appId: string;
    contentToExport: ExportableContent[];
    private jsonData;
    private moduleRole_ModuleRoleModelListCache;
    constructor(mendixToken: string, appId: string, branchName: string, contentToExport: ExportableContent[]);
    private setToken;
    validateAndGetBranch(): Promise<IBranch>;
    loadWorkingCopy(branchName: string): Promise<OnlineWorkingCopy>;
    extractModel(workingCopy: OnlineWorkingCopy, branch: IBranch): Promise<JsonData>;
    extractMetaModels(model: IModel, branch: IBranch): Promise<void>;
    /**
     * This function picks the first navigation document in the project.
     */
    loadModules(modules: projects.IModule[]): Promise<void>;
    loadUserRoles(userRoles: security.UserRole[]): void;
    loadEntityFromModule(entity: domainmodels.IEntity, module: projects.IModule): Promise<void>;
    loadMicroflowFromModule(microflow: microflows.IMicroflow): Promise<void>;
    loadNanoflowFromModule(nanoflow: microflows.INanoflow): Promise<void>;
    loadPageFromModule(page: pages.IPage): Promise<void>;
    addIfModuleRoleInUserRole(modRole: security.IModuleRole, userRole: security.UserRole): boolean;
    loadModSec(modSec: security.IModuleSecurity): Promise<security.ModuleSecurity>;
    /**
     * This function loads the project security.
     */
    loadModel(workingCopy: OnlineWorkingCopy): Promise<IModel>;
    loadProjectSecurity(model: IModel): Promise<security.ProjectSecurity>;
    addModuleRoleToList(modRole: security.IModuleRole, allowedModuleRole: ModuleRoleModel[]): void;
    addModulesRoleToList(modRoles: security.IModuleRole[], allowedModuleRole: ModuleRoleModel[]): void;
}
