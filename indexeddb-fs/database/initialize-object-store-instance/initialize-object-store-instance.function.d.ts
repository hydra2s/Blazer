import { IInitializeObjectStoreInstanceProps } from './initialize-object-store-instance.types';
export declare const initializeObjectStoreInstance: ({ databaseName, databaseVersion, objectStoreName }: IInitializeObjectStoreInstanceProps) => (type: IDBTransactionMode) => Promise<IDBObjectStore>;
