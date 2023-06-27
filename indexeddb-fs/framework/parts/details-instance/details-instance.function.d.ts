import { IDirectoryEntry, IFileEntry } from "../../../types";
import { IDetailsInstanceProps } from './details-instance.types';
export declare const detailsInstance: ({ directoryDetails, exists, fileDetails, isDirectory, isFile, rootDirectoryName }: IDetailsInstanceProps) => (fullPath: string) => Promise<IFileEntry<unknown> | IDirectoryEntry>;
