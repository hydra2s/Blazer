import { IFileEntry } from "../../../types";
import { IUpdateFileDetailsInstanceProps } from './update-file-details-instance.types';
export declare const updateFileDetailsInstance: ({ fileDetails, isDirectory, putRecord, rootDirectoryName }: IUpdateFileDetailsInstanceProps) => <TData = unknown>(fullPath: string, newFileEntry: Partial<IFileEntry<TData>>) => Promise<IFileEntry<TData>>;
