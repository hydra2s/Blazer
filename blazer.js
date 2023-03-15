export class BlazerBMP {
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
    encode() {
        this._module.makeARGB(this._from + 122, this.w, this.h);
        return new Blob([new Uint8Array(this._module.memory.buffer, this._from, this.fileLength)], {type: "image/bmp"});
    }
}

class PNGChunk {
    constructor() {
        this.data = null;
        this.view = null;
        this.length = 0;
        this.crc32 = 0;
        this.name = "";
        this.slice = null;
    }

    compile() {
        var view = new DataView(this.slice.buffer, this.slice.byteOffset, this.length+4+4+4);
        view.setUint32(0, /*view.byteLength-4-4-4*/this.length, false);
        view.setUint8(4, this.name.charCodeAt(0));
        view.setUint8(5, this.name.charCodeAt(1));
        view.setUint8(6, this.name.charCodeAt(2));
        view.setUint8(7, this.name.charCodeAt(3));
        view.setUint32(this.length+4+4, this.crc32 = CRC32.buf(new Uint8Array(this.slice.buffer, this.slice.byteOffset+4, this.length+4)), false);
        return this;
    }
    
}

//
class IDATLine {
    constructor(buffer, offset, stride, last, pack) {
        this.view = new DataView(buffer, offset, (this.stride = stride)+6);
        this.view.setUint8(0, last, false);
        this.view.setUint16(1, (stride+1), true); this.view.setUint16(3, ~(stride+1), true);
        this.view.setUint8(5, 0, false);
        new Uint8Array(buffer, offset+6, stride).set(pack);
        this.data = new Uint8Array(buffer, offset+5, stride+1);
    }
}


export class BlazerPNG {
    constructor() {
        
    }

    async init(chunks) {
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
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
        this.chunks = (this.ext = [...(chunks||[])]).filter((chunk)=>{
            chunk.name != "IHDR" && 
            chunk.name != "IDAT" && 
            chunk.name != "IEND";
        });

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
        var data = new ArrayBuffer(SIZE+4+4+4);
        IDAT.length = SIZE;
        IDAT.name = "IDAT";
        IDAT.data = new Uint8Array(data, 8, SIZE);
        IDAT.view = new DataView(data, 8, SIZE);
        IDAT.view.setUint8(0, 0x78, false);
        IDAT.view.setUint8(1, 1, false);
        let lines = [];
        for (let Y=0;Y<this.h;Y++) {
            lines.push(new IDATLine(IDAT.data.buffer, 8+2+(this.w*4+6)*Y, this.w*4, Y==this.h-1, this.ctx.getImageData(0,Y,this.w,1).data));
        }
        IDAT.view.setUint32(SIZE-4, ADLER32.buf(this.concat(Uint8Array, ...lines.map((L)=>L.data))), false);
        IDAT.slice = new Uint8Array(data);
        this.chunks.push(IDAT.compile());
        return this;
    }

    encodeIHDR() {
        var IHDR = new PNGChunk();
        var data = new ArrayBuffer(13+4+4+4);
        IHDR.length = 13;
        IHDR.name = "IHDR";
        IHDR.data = new Uint8Array(data, 8, 13);
        IHDR.view = new DataView(data, 8, 13);
        IHDR.view.setUint32(0, this.w, false);
        IHDR.view.setUint32(4, this.h, false);
        IHDR.view.setUint8(8, 8, false);
        IHDR.view.setUint8(9, 6, false);
        IHDR.view.setUint8(10, 0, false);
        IHDR.view.setUint8(11, 0, false);
        IHDR.view.setUint8(12, 0, false);
        IHDR.slice = new Uint8Array(data);
        this.chunks.splice(0, 0, IHDR.compile());
        return this;
    }

    encodeIEND() {
        var IEND = new PNGChunk();
        var data = new ArrayBuffer(0+4+4+4);
        IEND.length = 0;
        IEND.slice = new Uint8Array(data);
        IEND.name = "IEND";
        this.chunks.push(IEND.compile());
        return this;
    }

    encode() {
        this.encodeIHDR();
        this.encodeIDAT();
        this.encodeIEND();

        //
        return new Blob([this.PNGsignature, ...this.chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});
    }

    context(ctx, w, h) {
        this.ctx = ctx, this.w = w, this.h = h;

        //
        this.getPixelPack = (x,y,w,h)=>{ new Uint32Array(this._module.memory.buffer, this._payload, w*h).set(new Uint32Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return this._payload; };

        //
        return this;
    }
}

