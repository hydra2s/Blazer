import { IDeleteRecordInstanceProps } from './delete-record-instance.types';
export declare const deleteRecordInstance: ({ initializeObjectStore }: IDeleteRecordInstanceProps) => (key: IDBValidKey | IDBKeyRange) => Promise<void>;
