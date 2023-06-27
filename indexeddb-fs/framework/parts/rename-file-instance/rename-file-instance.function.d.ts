import { IFileEntry } from "../../../types";
import { IRenameFileInstanceProps } from './rename-file-instance.types';
export declare const renameFileInstance: ({ exists, isFile, removeFile, rootDirectoryName, updateFileDetails }: IRenameFileInstanceProps) => <TData = unknown>(fullPath: string, newFilename: string) => Promise<IFileEntry<TData>>;
