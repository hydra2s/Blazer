import { IDirectoryEntry } from "../../../types";
import { IDirectoryDetailsInstanceProps } from './directory-details-instance.types';
export declare const directoryDetailsInstance: ({ getRecord, isDirectory, rootDirectoryName }: IDirectoryDetailsInstanceProps) => (fullPath: string) => Promise<IDirectoryEntry>;
