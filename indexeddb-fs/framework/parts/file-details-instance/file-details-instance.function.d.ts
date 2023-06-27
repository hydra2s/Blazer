import { IFileEntry } from "../../../types";
import { IFileDetailsInstanceProps } from './file-details-instance.types';
export declare const fileDetailsInstance: ({ getRecord, isFile, rootDirectoryName }: IFileDetailsInstanceProps) => <TData = unknown>(fullPath: string) => Promise<IFileEntry<TData>>;
