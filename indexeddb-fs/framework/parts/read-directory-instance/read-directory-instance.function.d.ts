import { IReadDirectoryInstanceOutput, IReadDirectoryInstanceProps } from './read-directory-instance.types';
export declare const readDirectoryInstance: ({ isDirectory, openCursor, rootDirectoryName }: IReadDirectoryInstanceProps) => (fullPath: string) => Promise<IReadDirectoryInstanceOutput>;
