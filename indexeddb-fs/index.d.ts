declare const fs: import("./framework/create-fs.types").ICreateFsOutput;
export default fs;
export { IFileEntry, IDirectoryEntry } from "./types";
export { ICreateFsProps, ICreateFsOutput } from "./framework/create-fs.types";
export { createFs } from "./framework/create-fs.function";
