import { IExistsInstanceProps } from './exists-instance.types';
export declare const existsInstance: ({ getRecord, rootDirectoryName }: IExistsInstanceProps) => (fullPath: string) => Promise<boolean>;
