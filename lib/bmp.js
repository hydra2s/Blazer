import { swap32 } from "./utils.js";

//
export class BlazerBMP {
    constructor(imageData) {
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
        this._header = new Uint32Array([
            0x0000424d, // (-2) header byte with offset
            0x00000000, // (2) total length
            0x00000000, // (6) skip unused fields
            0x7a000000, // (10) offset to pixels
            0x6c000000, // (14) header size (108)
            0x00000000, // (18) width
            0x00000000, // (22) height
            0x01002000, // (26) 1 plane, 32-bits (RGBA)
            0x03000000, // (30) no compression (BI_BITFIELDS, 3)
            0x00000000, // (34) bitmap size incl. padding (stride x height)
            0x130B0000, // (38) pixels/meter h (~72 DPI x 39.3701 inch/m)
            0x130B0000, // (42) pixels/meter v
            0x00000000, // (46) skip color/important colors
            0x00000000, // (50) skip color/important colors
            0x00FF0000, // (54) red channel mask
            0x0000FF00, // (60) green channel mask
            0x000000FF, // (64) blue channel mask
            0xFF000000, // (66) alpha channel mask
            0x206e6957  // (70) " win" color space
        ]).map(swap32);
        return this;
    }

    async alloc() {
        let pixelArraySize = (((32 * this.w + 31) / 32) << 2) * this.h;
        let fileAlloc = this._module.alloc((this.fileLength = 122 + pixelArraySize)+2); this.toFree.push(fileAlloc);
        new Uint32Array(this._module.memory.buffer, fileAlloc, 124).set(this._header);

        //
        let _view = new DataView(this._module.memory.buffer, (this._from = fileAlloc+2), 38);
            _view.setUint32(2, this.fileLength, true);
            _view.setUint32(18, this.w, true);
            _view.setUint32(22, -this.h >>> 0, true);
            _view.setUint32(34, pixelArraySize, true);
    }

    async shared(buffer, w, h) {
        this.buffer = buffer, this.w = w, this.h = h;
        this.getPixelPack = (x,y,w,h,P)=>{ new Uint32Array(this._module.memory.buffer, P, w).set(new Uint32Array(buffer, y*w*4, w)); return P; };
        this.alloc();
        return this;
    }

    async context(ctx, w, h) {
        this.ctx = ctx, this.w = w, this.h = h;
        this.getPixelPack = (x,y,w,h,P)=>{ new Uint32Array(this._module.memory.buffer, P, w*h).set(new Uint32Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return P; };
        this.alloc();
        return this;
    }

    // for real-time animations support
    encode() {
        this._module.makeARGB(this._from + 122, this.w, this.h);
        return URL.createObjectURL(new Blob([new Uint8Array(this._module.memory.buffer, this._from, this.fileLength)], {type: "image/bmp"}));
    }

    //
    free() {
        // fix memory leak
        this.toFree.map(this._module.free.bind(this._module));
        this.toFree = [];
    }
}
