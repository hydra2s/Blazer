import { IGetRecordInstanceProps } from './get-record-instance.types';
export declare const getRecordInstance: ({ initializeObjectStore }: IGetRecordInstanceProps) => <TValue>(query: IDBValidKey | IDBKeyRange, onResolve: (target: IDBRequest) => TValue) => Promise<TValue>;
