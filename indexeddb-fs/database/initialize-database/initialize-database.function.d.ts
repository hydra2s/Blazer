import { IInitializeDatabaseProps } from './initialize-database.types';
export declare const initializeDatabase: ({ databaseName, databaseVersion, objectStoreName, }: IInitializeDatabaseProps) => Promise<IDBDatabase>;
