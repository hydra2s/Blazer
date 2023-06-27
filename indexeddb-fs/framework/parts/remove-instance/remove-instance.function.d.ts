import { IRemoveInstanceProps } from './remove-instance.types';
export declare const removeInstance: ({ deleteRecord, exists, rootDirectoryName }: IRemoveInstanceProps) => (fullPath: string) => Promise<void>;
