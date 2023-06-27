import { IIsDirectoryInstanceProps } from './is-directory-instance.types';
export declare const isDirectoryInstance: ({ exists, getRecord, rootDirectoryName }: IIsDirectoryInstanceProps) => (fullPath: string) => Promise<boolean>;
