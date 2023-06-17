/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/makeARGB
 * @param fileData `usize`
 * @param width `u32`
 * @param height `u32`
 */
export declare function makeARGB(fileData: number, width: number, height: number): void;
/**
 * assembly/index/makeBGRA
 * @param fileData `usize`
 * @param width `u32`
 * @param height `u32`
 */
export declare function makeBGRA(fileData: number, width: number, height: number): void;
/**
 * assembly/index/makeRGBA
 * @param fileData `usize`
 * @param width `u32`
 * @param height `u32`
 */
export declare function makeRGBA(fileData: number, width: number, height: number): void;
/**
 * assembly/index/premakeA
 * @param fileData `usize`
 * @param payload `usize`
 * @param width `u32`
 * @param height `u32`
 */
export declare function premakeA(fileData: number, payload: number, width: number, height: number): void;
/**
 * assembly/index/makePNGData
 * @param fileData `usize`
 * @param payload `usize`
 * @param width `u32`
 * @param height `u32`
 */
export declare function makePNGData(fileData: number, payload: number, width: number, height: number): void;
/**
 * assembly/index/makePNGData_RGBX32
 * @param fileData `usize`
 * @param payload `usize`
 * @param width `u32`
 * @param height `u32`
 */
export declare function makePNGData_RGBX32(fileData: number, payload: number, width: number, height: number): void;
/**
 * assembly/index/alloc
 * @param size `u32`
 * @returns `usize`
 */
export declare function alloc(size: number): number;
/**
 * assembly/index/free
 * @param ptr `u32`
 */
export declare function free(ptr: number): void;
