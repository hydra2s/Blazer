import { IIsFileInstanceProps } from './is-file-instance.types';
export declare const isFileInstance: ({ exists, getRecord, rootDirectoryName }: IIsFileInstanceProps) => (fullPath: string) => Promise<boolean>;
