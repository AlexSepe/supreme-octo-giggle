import { setPlatformConfig, MendixPlatformClient, OnlineWorkingCopy, App, IBranch } from "mendixplatformsdk";
import { IModel, projects, domainmodels, microflows, pages, navigation, texts, security, IStructure, menus, IList, nanoflows } from "mendixmodelsdk";
import Module = require("module");
import { ModuleModel, ModuleRoleModel, UserRoleModel, EntityModel, MicroflowModel, NanoflowModel, PageModel, JsonData } from "./jsonData";

export enum ExportableContent {
  PAGES,
  ENTITIES,
  MICROFLOWS,
  NANOFLOWS,
}

/*
 * PROJECT TO ANALYZE
 */
export class ModelSdkExtractor {
  app: App;
  client: MendixPlatformClient;
  branchName: string;
  mendixToken: string;
  appId: string;
  contentToExport: ExportableContent[];

  private jsonData: JsonData;
  private moduleRole_ModuleRoleModelListCache = new Map<string, ModuleRoleModel>();  

  constructor(mendixToken: string, appId: string, branchName: string, contentToExport: ExportableContent[]) {
    this.client = new MendixPlatformClient();    
    this.branchName = branchName;
    this.mendixToken = mendixToken;
    this.contentToExport = contentToExport;    
    this.appId = appId;
    
    this.setToken();
    this.app = this.client.getApp(appId);
  }

  /*setPlatConfig do Mendix não é threadSafe! Resetamos para evitar conflitos.*/
  private setToken(){
    setPlatformConfig({
      mendixToken: this.mendixToken, 
    });
  }

  public async validateAndGetBranch(): Promise<IBranch> {
    var useBranch: string = "";
    this.setToken();
    const repository = this.app.getRepository();

    if (this.branchName === null) {
      var repositoryInfo = await repository.getInfo();
      if (repositoryInfo.type === `svn`) useBranch = `trunk`;
      else useBranch = `main`;
    } else {
      useBranch = this.branchName;
    }

    return await repository.getBranch(this.branchName);
  }

  public async loadWorkingCopy(branchName: string): Promise<OnlineWorkingCopy> {
    console.time("workingcopy-"+this.appId);
    this.setToken();
    const workingCopy = await this.app.createTemporaryWorkingCopy(branchName);
    console.timeEnd("workingcopy-"+this.appId);

    return workingCopy;
  }

  public async extractModel(workingCopy: OnlineWorkingCopy, branch: IBranch) {
    const model = await this.loadModel(workingCopy);

    console.time("extractModel-"+this.appId);
    await this.extractMetaModels(model, branch);
    console.timeEnd("extractModel-"+this.appId);
    return this.jsonData;
  }

  async extractMetaModels(model: IModel, branch: IBranch) {
    const projectSecurity = await this.loadProjectSecurity(model);
    const userRoles = projectSecurity.userRoles;
    const modules = model.allModules();    

    //init result obj...
    this.moduleRole_ModuleRoleModelListCache.clear();
    this.jsonData = {
      latestCommit: {
        branchName: branch.name,
        id: branch.latestCommit.id,
        date: branch.latestCommit.date,
        message: branch.latestCommit.message,
        mendixVersion: branch.latestCommit.mendixVersion,
        author: branch.latestCommit.author.email
      },
      modules: [],
      pages: [],
      entities: [],
      microflows: [],
      nanoflows: [],
      userRoles: [],
    };

    //store modules----------
    await this.loadModules(modules);

    //store userRoles-----------
    this.loadUserRoles(userRoles);

    if (this.contentToExport.indexOf(ExportableContent.ENTITIES) >= 0) {
      //store Entities
      await Promise.all(
        modules.map(async (moduleMap) => {
          const domainModel = await moduleMap.domainModel.load();
          await Promise.all(domainModel.entities.map(async (entity) => this.loadEntityFromModule(entity, moduleMap)));
        })
      );
    }

    if (this.contentToExport.indexOf(ExportableContent.MICROFLOWS) >= 0) {
      //store Microflows
      const microflows = await model.allMicroflows();
      await Promise.all(microflows.map(async (microflow) => this.loadMicroflowFromModule(microflow)));
    }

    if (this.contentToExport.indexOf(ExportableContent.NANOFLOWS) >= 0) {
      //store Nanoflows
      const nanoflows = await model.allNanoflows();
      await Promise.all(nanoflows.map(async (nanoflow) => this.loadNanoflowFromModule(nanoflow)));
    }

    if (this.contentToExport.indexOf(ExportableContent.PAGES) >= 0) {
      //store Pages
      const pages = await model.allPages();
      await Promise.all(pages.map(async (page) => this.loadPageFromModule(page)));
    }
  }

  /**
   * This function picks the first navigation document in the project.
   */
  async loadModules(modules: projects.IModule[]) {
    await Promise.all(
      modules.map(async (moduleMap) => {
        const moduleSecurity: security.ModuleSecurity = await this.loadModSec(moduleMap.moduleSecurity);

        //console.log(`** Module: ${moduleMap.name} ** `);
        const moduleObj: ModuleModel = {
          fromAppStore: moduleMap.fromAppStore,
          name: moduleMap.name,
          version: moduleMap.appStoreVersion,
          moduleRoles: [],
        };
        //save output
        this.jsonData.modules.push(moduleObj);

        //load module roles.
        moduleSecurity.moduleRoles.forEach((modRole) => {
          const moduleRoleModel: ModuleRoleModel = modRole.qualifiedName;
          // {
          //   name: modRole.name,
          //   qualifiedName: modRole.qualifiedName,
          //   moduleName: moduleMap.name,
          // };
          //store ref. modules and caches...
          moduleObj.moduleRoles.push(moduleRoleModel);
          this.moduleRole_ModuleRoleModelListCache.set(modRole.qualifiedName, moduleRoleModel);
          //console.log(`  _Module: ${moduleMap.name} ModRole: ${modRole.name} - ${modRole.qualifiedName} `);
        });
      })
    );
  }

  loadUserRoles(userRoles: security.UserRole[]) {
    userRoles.map((userRoleMap) => {
      //console.log(`** UserRole: ${userRoleMap.name} Guid: ${userRoleMap.guid} **`);

      const userRoleObj: UserRoleModel = {
        name: userRoleMap.name,
        allowedModuleRole: [],
      };
      //save output
      this.jsonData.userRoles.push(userRoleObj);

      //load User Module roles.
      userRoleMap.moduleRoles
        .filter((modRole) => this.addIfModuleRoleInUserRole(modRole, userRoleMap))
        .forEach((modRole) => {
          if (!modRole || !modRole.qualifiedName) return;
          //store ref. modules and caches...
          this.addModuleRoleToList(modRole, userRoleObj.allowedModuleRole);         
          //console.log(`  _ UserRole: ${userRoleMap.name} ModRole: ${modRole.name} - ${modRole.qualifiedName} `);
        });
    });
  }

  async loadEntityFromModule(entity: domainmodels.IEntity, module: projects.IModule): Promise<void> {
    const loadedEntity = await entity.load();
    const accessRules = loadedEntity.accessRules;
    if (accessRules.length <= 0) {
      return;
    }

    //entities
    //console.log(`** Entity : ${entity.qualifiedName} **`);

    const entityObj: EntityModel = {
      name: entity.name,
      qualifiedName: entity.qualifiedName,
      moduleName: module.name,
      allowedModuleRole: [],
    };
    //save output
    this.jsonData.entities.push(entityObj);

    accessRules.map((rule) => {
      this.addModulesRoleToList(rule.moduleRoles, entityObj.allowedModuleRole);

      // var memberRules = ``;
      // rule.memberAccesses.map( (memRule) => {
      //   if (memRule != null) {
      //     if (memRule.accessRights != null && memRule.attribute != null) {
      //       memberRules += `${memRule.attribute.name}: ${memRule.accessRights.name}\n`;
      //     }
      //   }
      // });
      // var createDelete;
      // if (rule.allowCreate && rule.allowDelete) {
      //   createDelete = `Create/Delete`;
      // } else if (rule.allowCreate) {
      //   createDelete = `Create`;
      // } else if (rule.allowDelete) {
      //   createDelete = `Delete`;
      // } else {
      //   createDelete = `None`;
      // }

      // entityObj.rules.push({
      //   createDelete: createDelete,
      //   memberRules: memberRules,
      //   xPathConstraint: rule.xPathConstraint,
      //   rule.moduleRoles
      // });
    });
  }

  async loadMicroflowFromModule(microflow: microflows.IMicroflow): Promise<void> {
    const allowedRolesNotNull = microflow.allowedModuleRoles.filter((allowedRole) => allowedRole);
    if (allowedRolesNotNull.length <= 0) {
      return;
    }

    const moduleName = microflow.qualifiedName.split(".")[0];
    //Microflows
    //console.log(`** Microflow : ${microflow.qualifiedName} **`);
    //const loadedMicroflow = await microflow.load();

    const microflowObj: MicroflowModel = {
      name: microflow.name,
      qualifiedName: microflow.qualifiedName,
      moduleName: moduleName,
      allowedModuleRole: [],
    };
    //save output
    this.jsonData.microflows.push(microflowObj);

    this.addModulesRoleToList(allowedRolesNotNull, microflowObj.allowedModuleRole);
  }

  async loadNanoflowFromModule(nanoflow: microflows.INanoflow): Promise<void> {
    const allowedRolesNotNull = nanoflow.allowedModuleRoles.filter((allowedRole) => allowedRole);
    if (allowedRolesNotNull.length <= 0) {
      return;
    }
    const moduleName = nanoflow.qualifiedName.split(".")[0];
    //Nanoflows
    //console.log(`** Nanoflow : ${nanoflow.qualifiedName} **`);
    //const loadedNanoflow = await nanoflow.load();

    const nanoflowObj: NanoflowModel = {
      name: nanoflow.name,
      qualifiedName: nanoflow.qualifiedName,
      moduleName: moduleName,
      allowedModuleRole: [],
    };
    //save output
    this.jsonData.nanoflows.push(nanoflowObj);

    this.addModulesRoleToList(allowedRolesNotNull, nanoflowObj.allowedModuleRole);
  }

  async loadPageFromModule(page: pages.IPage): Promise<void> {
    const allowedRolesNotNull = page.allowedRoles.filter((allowedRole) => allowedRole);
    if (allowedRolesNotNull.length <= 0) {
      return;
    }
    const moduleName = page.qualifiedName.split(".")[0];
    //Pages
    //console.log(`** Page : ${page.qualifiedName} **`);
    const loadedPage = await page.load();
    const pageTitle = loadedPage.title.translations.length > 0 ? loadedPage.title.translations[0].text : "-";
    const pageObj: PageModel = {
      name: page.name,
      qualifiedName: page.qualifiedName,
      moduleName: moduleName,
      title: pageTitle,
      allowedModuleRole: [],
    };
    //save output
    this.jsonData.pages.push(pageObj);

    this.addModulesRoleToList(allowedRolesNotNull, pageObj.allowedModuleRole);
  }

  addIfModuleRoleInUserRole(modRole: security.IModuleRole, userRole: security.UserRole): boolean {
    //console.debug(`Processing module[${modRole.containerAsModuleSecurity.containerAsModule.name}] role: ${modRole.name} for userRole: ${userRole.name}`);
    if (!modRole) {
      return false;
    }
    if (
      userRole.moduleRoles.some((modRoleFilter) => {
        if (modRoleFilter != null) {
          var result = false;
          try {
            result = modRoleFilter.qualifiedName === modRole.qualifiedName;
            //console.debug(`comparando:: ${modRoleFilter.qualifiedName} x ${modRole.qualifiedName}`);
          } catch (error) {
            console.debug(
              `****** não foi possivel comparar o negocio! :: ${modRoleFilter.isLoaded} modRoleFilter=${JSON.stringify(modRoleFilter)} || modRole=${JSON.stringify(modRole)}`
            );
          }
          return result;
        } else {
          return false;
        }
      })
    ) {
      return true;
    } else {
      return false;
    }
  }

  async loadModSec(modSec: security.IModuleSecurity): Promise<security.ModuleSecurity> {
    // console.debug(`Processing loadModSec`);
    return modSec.load();
  }

  /**
   * This function loads the project security.
   */
  async loadModel(workingCopy: OnlineWorkingCopy): Promise<IModel> {
    var model: IModel = await workingCopy.openModel();
    return model;
  }

  async loadProjectSecurity(model: IModel): Promise<security.ProjectSecurity> {
    var security = model.allProjectSecurities()[0];
    return await security.load();
  }

  addModuleRoleToList(modRole: security.IModuleRole, allowedModuleRole: ModuleRoleModel[]) {
    //avoid duplicados...
    //if (allowedModuleRole.some((mr) => mr.qualifiedName === modRole.qualifiedName)) {
    if (allowedModuleRole.some((mr) => mr === modRole.qualifiedName)) {
      return;
    }
    var mroleModel = this.moduleRole_ModuleRoleModelListCache.get(modRole.qualifiedName);
    if (mroleModel) {
      allowedModuleRole.push(mroleModel);
    }
  }

  addModulesRoleToList(modRoles: security.IModuleRole[], allowedModuleRole: ModuleRoleModel[]) {
    modRoles.forEach((modRole) => this.addModuleRoleToList(modRole, allowedModuleRole));
  }
}
