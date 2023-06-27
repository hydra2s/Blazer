export declare const tryCatchWrapper: <TData = unknown>(func: () => Promise<TData>, onError?: ((error: unknown) => void) | undefined) => Promise<TData | null>;
