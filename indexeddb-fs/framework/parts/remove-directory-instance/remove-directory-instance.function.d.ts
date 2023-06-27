import { IRemoveDirectoryInstanceProps } from './remove-directory-instance.types';
export declare const removeDirectoryInstance: ({ isDirectory, readDirectory, remove, rootDirectoryName, }: IRemoveDirectoryInstanceProps) => (fullPath: string) => Promise<void>;
