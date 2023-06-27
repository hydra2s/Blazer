import { IPutRecordInstanceProps } from './put-record-instance.types';
export declare const putRecordInstance: ({ initializeObjectStore }: IPutRecordInstanceProps) => <TValue = unknown>(value: TValue) => Promise<TValue>;
