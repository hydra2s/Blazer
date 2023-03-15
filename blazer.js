export class Blazer {
    constructor(imageData) {
        
    }

    async init() {
        this.getPixelPack = ()=>{ return 0; };

        //
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
                    getPixelPack: (x,y,w,h)=>{ return this.getPixelPack(x,y,w,h); }
                }
            }
        ))(new URL("build/release.wasm", import.meta.url));
        this._module = _module;
        
        //
        this._header = new Uint8Array([ // TODO: encode as UINT32
            0x42, 0x4d,             // (0) BM
            0x00, 0x00, 0x00, 0x00, // (2) total length
            0x00, 0x00, 0x00, 0x00, // (6) skip unused fields
            0x7a, 0x00, 0x00, 0x00, // (10) offset to pixels
            0x6c, 0x00, 0x00, 0x00, // (14) header size (108)
            0x00, 0x00, 0x00, 0x00, // (18) width
            0x00, 0x00, 0x00, 0x00, // (22) height
            1, 0x00,   32, 0x00, // (26) 1 plane, 32-bits (RGBA)
            3, 0x00, 0x00, 0x00, // (30) no compression (BI_BITFIELDS, 3)
            0x00, 0x00, 0x00, 0x00, // (34) bitmap size incl. padding (stride x height)
            0x13, 0xB , 0x00, 0x00, // (38) pixels/meter h (~72 DPI x 39.3701 inch/m)
            0x13, 0xB , 0x00, 0x00, // (42) pixels/meter v
            0x00, 0x00, 0x00, 0x00, // (46) skip color/important colors
            0x00, 0x00, 0x00, 0x00, // (50) skip color/important colors
            0x00, 0xFF, 0x00, 0x00, // (54) red channel mask
            0x00, 0x00, 0xFF, 0x00, // (60) green channel mask
            0x00, 0x00, 0x00, 0xFF, // (64) blue channel mask
            0xFF, 0x00, 0x00, 0x00, // (66) alpha channel mask
            //0xFF, 0x00, 0x00, 0x00, // (54) red channel mask
            //0x00, 0xFF, 0x00, 0x00, // (60) green channel mask
            //0x00, 0x00, 0xFF, 0x00, // (64) blue channel mask
            //0x00, 0x00, 0x00, 0xFF, // (66) alpha channel mask
            0x20, 0x6e, 0x69, 0x57  // (70) " win" color space
        ]);
        return this;
    }

    context(ctx, w, h) {
        this.ctx = ctx, this.w = w, this.h = h;
        let stride         = ((32 * w + 31) / 32) << 2,
            pixelArraySize = stride * h;

        //
        this.fileLength = 122 + pixelArraySize;
        this._from = this._module.alloc(this.fileLength+2)+2;
        this._payload = this._module.alloc(w);
        new Uint8Array(this._module.memory.buffer, this._from, 122).set(this._header);

        //
        let _view = new DataView(this._module.memory.buffer, this._from, 122);
        _view.setUint32(2, this.fileLength, true);
        _view.setUint32(18, w, true);
        _view.setUint32(22, -h >>> 0, true);
        _view.setUint32(34, pixelArraySize, true);

        //
        this.getPixelPack = (x,y,w,h)=>{ new Uint32Array(this._module.memory.buffer, this._payload, w*h).set(new Uint32Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return this._payload; };

        //
        return this;
    }

    // for real-time animations support
    record() {
        this._module.makeARGB(this._from + 122, this.w, this.h);
        return new Blob([new Uint8Array(this._module.memory.buffer, this._from, this.fileLength)], {type: "image/bmp"});
    }
}
