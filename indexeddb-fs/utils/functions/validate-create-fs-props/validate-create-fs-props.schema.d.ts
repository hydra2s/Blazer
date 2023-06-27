export declare const createFsPropsSchema: {
    type: string;
    id: string;
    properties: {
        databaseName: {
            minLength: number;
            maxLength: number;
            type: string;
            pattern: string;
        };
        objectStoreName: {
            minLength: number;
            maxLength: number;
            type: string;
            pattern: string;
        };
        rootDirectoryName: {
            minLength: number;
            maxLength: number;
            type: string;
            pattern: string;
        };
        databaseVersion: {
            minimum: number;
            maximum: number;
            type: string;
        };
    };
    required: string[];
};
