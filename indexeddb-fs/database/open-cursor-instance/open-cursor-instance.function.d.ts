import { IOpenCursorInstanceProps } from './open-cursor-instance.types';
export declare const openCursorInstance: ({ initializeObjectStore }: IOpenCursorInstanceProps) => <TValue>(value: unknown, onResolve: (target: IDBRequest, resolve: (value: TValue) => void) => TValue) => Promise<TValue>;
