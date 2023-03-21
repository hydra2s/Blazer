import { swap32 } from "./utils.js";
import * as CRC32 from "../node_modules/crc-32/crc32.mjs";

// 
export class PNGChunk {
    constructor(slice,name="IEND",length=0) {
        this.data = null;
        this.view = null;
        this.length = length;
        this.name = name;
        this.slice = slice;
        this.crc32 = 0;
    }

    compile() {
        var view = new DataView(this.slice.buffer, this.slice.byteOffset, this.length+4+4+4);
        view.setUint32(0, this.length, false);
        view.setUint32(4, this.name.charCodeAt(0) | (this.name.charCodeAt(1)<<8) | (this.name.charCodeAt(2)<<16) | (this.name.charCodeAt(3)<<24), true);
        view.setUint32(this.length+4+4, this.crc32 = CRC32.buf(new Uint8Array(this.slice.buffer, this.slice.byteOffset+4, this.length+4)), false);
        return this;
    }
}

// NOT FASTEST YET!
export class BlazerPNG {
    constructor() {
        this.toFree = [];
    }

    async init() {
        this.getPixelPack = ()=>{ return 0; };

        //
        let self = this;
        async function instantiate(module, imports = {}) {
            const adaptedImports = {
                env: Object.assign(Object.create(globalThis), imports.env || {}, 
                {
                    abort(message, fileName, lineNumber, columnNumber) {
                        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
                        message = __liftString(message >>> 0);
                        fileName = __liftString(fileName >>> 0);
                        lineNumber = lineNumber >>> 0;
                        columnNumber = columnNumber >>> 0;
                        (() => {
                        // @external.js
                        throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
                        })();
                    },
                }),
            };
            const { exports } = await WebAssembly.instantiate(module, adaptedImports);
            const memory = exports.memory || imports.env.memory;
            const adaptedExports = Object.setPrototypeOf({
                alloc(size) {
                    return exports.alloc(size) >>> 0;
                },
            }, exports);
            function __liftString(pointer) {
                if (!pointer) return null;
                const end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1, memoryU16 = new Uint16Array(memory.buffer);
                let start = pointer >>> 1, string = "";
                while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
                return string + String.fromCharCode(...memoryU16.subarray(start, end));
            }
            return adaptedExports;
        }
        const _module = await (async url => instantiate(await (async () => {
                try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
                catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
            })(), {
                env: {
                    getPixelPack: (x,y,w,h,P)=>{ return self.getPixelPack.call(self,x,y,w,h,P); }
                }
            }
        ))("../build/release.wasm");
        this._module = _module;
        
        //
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);

        //
        return this;
    }

    concat(resultConstructor, ...arrays) {
        let totalLength = 0;
        for (let arr of arrays) {
            totalLength += arr.length;
        }
        let result = new resultConstructor(totalLength);
        let offset = 0;
        for (let arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    encodeIDAT() {
        var IDAT = new PNGChunk();
        var SIZE = 2 + this.h * (6 + this.w*4) + 4;
        var data = this._module.alloc(Math.ceil((SIZE+4+4+4)/16)*16);
        IDAT.length = SIZE;
        IDAT.name = "IDAT";
        IDAT.data = new Uint8Array(this._module.memory.buffer, data+8, SIZE);
        IDAT.view = new DataView(this._module.memory.buffer, data+8, SIZE);
        IDAT.view.setUint16(0, 0x7801, false);

        //
        this._module.makePNGData(data+8+2,this.w,this.h);

        //
        IDAT.slice = new Uint8Array(this._module.memory.buffer, data, SIZE+4+4+4);
        this.chunks.push(IDAT.compile());
        this.toFree.push(data);
        return this;
    }

    encodeIHDR() {
        var IHDR = new PNGChunk();
        var data = this._module.alloc(13+4+4+4);
        IHDR.length = 13;
        IHDR.name = "IHDR";
        IHDR.data = new Uint8Array(this._module.memory.buffer, data+8, 13);
        IHDR.view = new DataView(this._module.memory.buffer, data+8, 13);
        IHDR.view.setUint32(0, this.w, false);
        IHDR.view.setUint32(4, this.h, false);
        IHDR.view.setUint32(8, 0x08060000, false);
        IHDR.view.setUint8(12, 0, false);
        IHDR.slice = new Uint8Array(this._module.memory.buffer, data, 13+4+4+4);
        this.chunks.splice(0, 0, IHDR.compile());
        this.toFree.push(data);
        return this;
    }

    encodeIEND() {
        var IEND = new PNGChunk();
        var data = this._module.alloc(0+4+4+4);
        IEND.length = 0;
        IEND.slice = new Uint8Array(this._module.memory.buffer, data, 0+4+4+4);
        IEND.name = "IEND";
        this.chunks.push(IEND.compile());
        this.toFree.push(data);
        return this;
    }

    encode(chunks) {
        this.chunks = [...(chunks||[])].filter((C)=>{ return C.name != "IHDR" && C.name != "IDAT" && C.name != "IEND"; });
        
        // TODO: store IDAT for recoding
        this.encodeIHDR();
        this.encodeIDAT();
        this.encodeIEND();
        
        //
        chunks = this.chunks; this.chunks = [];

        //
        //chunks = this.chunks; this.chunks = [];
        const blob = new Blob([this.PNGsignature, ...chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});

        // fix memory leak
        this.toFree.map(this._module.free.bind(this._module));
        this.toFree = [];

        //
        return blob;
    }

    async shared(imageData) {
        this.buffer = await (imageData.data?.buffer || imageData.data), this.w = await imageData.width, this.h = await imageData.height;
        this.getPixelPack = (x,y,w,h,P)=>{ new Uint32Array(this._module.memory.buffer, P, w).set(new Uint32Array(this.buffer, y*w*4, w)); return P; };
        return this;
    }

    async context(ctx) {
        this.ctx = await ctx, this.w = await ctx.canvas.width, this.h = await ctx.canvas.height;
        this.getPixelPack = (x,y,w,h,P)=>{ new Uint8Array(this._module.memory.buffer, P, w*h*4).set(new Uint8Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return P; };
        return this;
    }
}
