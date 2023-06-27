import { IDirectoryEntry } from "../../../types";
import { ICreateDirectoryInstanceProps } from './create-directory-instance.types';
export declare const createDirectoryInstance: ({ isDirectory, isFile, putRecord, rootDirectoryName }: ICreateDirectoryInstanceProps) => (fullPath: string) => Promise<IDirectoryEntry>;
