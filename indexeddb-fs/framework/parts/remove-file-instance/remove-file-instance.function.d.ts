import { IRemoveFileInstanceProps } from './remove-file-instance.types';
export declare const removeFileInstance: ({ deleteRecord, isFile, rootDirectoryName }: IRemoveFileInstanceProps) => (fullPath: string) => Promise<void>;
