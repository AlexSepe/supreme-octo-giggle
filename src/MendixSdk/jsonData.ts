export type UserRoleModel = {
  name: string;
  allowedModuleRole: ModuleRoleModel[];
};
export type ModuleRoleModel = string;
// {
//   name: string;
//   qualifiedName: string;
//   moduleName: string;
// };
export type ModuleModel = {
  name: string;
  version: string;
  fromAppStore: boolean;
  moduleRoles: ModuleRoleModel[];
};
type BaseModuleModel = {
  name: string;
  qualifiedName: string;
  moduleName: string;
  allowedModuleRole: ModuleRoleModel[];
};
export interface PageModel extends BaseModuleModel {
  title: string;
}
export interface EntityModel extends BaseModuleModel {
}
export interface MicroflowModel extends BaseModuleModel { }
export interface NanoflowModel extends BaseModuleModel { }

export interface LatestCommit {
    branchName: string;
    /** Commit ID. */
    id: string;    
    author: string;
    /** The commit date and time in RFC 3339 format. */
    date: string;
    /** The commit message. */
    message: string;
    /** The Mendix version used to make this commit, if available. */
    mendixVersion?: string;
}

export type JsonData = {
  latestCommit: LatestCommit;
  modules: ModuleModel[];
  pages: PageModel[];
  entities: EntityModel[];
  microflows: MicroflowModel[];
  nanoflows: NanoflowModel[];
  userRoles: UserRoleModel[];
};

