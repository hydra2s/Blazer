import { IFileEntry } from "../../../types";
import { IMoveFileInstanceProps } from './move-file-instance.types';
export declare const moveFileInstance: ({ exists, isDirectory, isFile, removeFile, rootDirectoryName, updateFileDetails }: IMoveFileInstanceProps) => <TData = unknown>(sourcePath: string, destinationPath: string) => Promise<IFileEntry<TData>>;
