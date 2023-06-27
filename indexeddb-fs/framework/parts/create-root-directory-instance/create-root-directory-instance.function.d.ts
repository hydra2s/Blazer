import { IDirectoryEntry } from "../../../types";
import { ICreateRootDirectoryInstanceProps } from './create-root-directory-instance.types';
export declare const createRootDirectoryInstance: ({ putRecord, rootDirectoryName }: ICreateRootDirectoryInstanceProps) => () => Promise<IDirectoryEntry | null>;
