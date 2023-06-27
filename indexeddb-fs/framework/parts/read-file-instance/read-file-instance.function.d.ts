import { IReadFileInstanceProps } from './read-file-instance.types';
export declare const readFileInstance: ({ fileDetails }: IReadFileInstanceProps) => <TData = unknown>(fullPath: string) => Promise<TData>;
