import { IFileEntry } from "../../../types";
import { IWriteFileInstanceProps } from './write-file-instance.types';
export declare const writeFileInstance: ({ isDirectory, putRecord, rootDirectoryName }: IWriteFileInstanceProps) => <TData = unknown>(fullPath: string, data: TData) => Promise<IFileEntry<TData>>;
