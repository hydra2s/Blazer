import { IFileEntry } from "../../../types";
import { ICopyFileInstanceProps } from './copy-file-instance.types';
export declare const copyFileInstance: ({ exists, fileDetails, isDirectory, isFile, rootDirectoryName, writeFile }: ICopyFileInstanceProps) => <TData = unknown>(sourcePath: string, destinationPath: string) => Promise<IFileEntry<TData>>;
