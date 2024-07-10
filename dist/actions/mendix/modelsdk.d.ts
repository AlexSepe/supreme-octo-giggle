import { Action, ParamsFrom } from "actionhero";
export declare class ModelSdk extends Action {
    name: string;
    description: string;
    inputs: {
        mendixToken: {
            required: boolean;
        };
        appId: {
            required: boolean;
        };
        branchName: {
            required: boolean;
        };
        exportPages: {
            required: boolean;
            default: boolean;
        };
        exportMicroflows: {
            required: boolean;
            default: boolean;
        };
        exportNanoflows: {
            required: boolean;
            default: boolean;
        };
        exportEntities: {
            required: boolean;
            default: boolean;
        };
    };
    run({ params }: {
        params: ParamsFrom<ModelSdk>;
    }): Promise<{
        data: {
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
    }>;
}
export declare class ModelSdkList extends Action {
    name: string;
    description: string;
    inputs: {
        limit: {
            required: boolean;
            default: number;
        };
        offset: {
            required: boolean;
            default: number;
        };
    };
    run({ params }: {
        params: ParamsFrom<ModelSdkList>;
    }): Promise<{
        data: {
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
        }[];
    }>;
}
export declare class ModelSdkView extends Action {
    name: string;
    description: string;
    middleware: any[];
    inputs: {
        jobId: {
            required: boolean;
        };
    };
    run({ params }: {
        params: ParamsFrom<ModelSdkView>;
    }): Promise<{
        data: {
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
    }>;
}
export declare class ModelSdkViewData extends Action {
    name: string;
    description: string;
    middleware: any[];
    inputs: {
        jobId: {
            required: boolean;
        };
    };
    run({ params }: {
        params: ParamsFrom<ModelSdkView>;
    }): Promise<{
        data: any;
    }>;
}
