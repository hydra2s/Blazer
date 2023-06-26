import { swap32 } from "./utils.js";
import * as CRC32 from "../deps/crc32.mjs";
import { _module, _temp } from "./module.js";

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
// TODO: ZLIB compression support!
export class BlazerPNG {
    constructor() {
        this.toFree = [];
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
    }

    async init() {
        this._module = await _module;
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

    encodeIDAT2() {
        var IDAT = new PNGChunk();
        var SIZE = 2 + this.h * (6 + this.w*4) + 4;
        var data = this._module.alloc(SIZE+4+4+4);
        var payload = this._module.alloc(this.w*4);

        //
        IDAT.length = SIZE;
        IDAT.name = "IDAT";
        IDAT.data = new Uint8Array(this._module.memory.buffer, data+8, SIZE);
        IDAT.view = new DataView(this._module.memory.buffer, data+8, SIZE);
        IDAT.view.setUint16(0, 0x7801, false);

        //
        this._module.premakeA(data+8+2, this.Adraw(payload),this.w,this.h);
        this._module.makePNGData_RGBX32(data+8+2, this.RGBdraw(payload),this.w,this.h);

        //
        IDAT.slice = new Uint8Array(this._module.memory.buffer, data, SIZE+4+4+4);
        this.chunks.push(IDAT.compile());
        this.toFree.push(data, payload);
        return this;
    }

    encodeIDAT() {
        var IDAT = new PNGChunk();
        var SIZE = 2 + this.h * (6 + this.w*4) + 4;
        var data = this._module.alloc(SIZE+4+4+4);

        //
        IDAT.length = SIZE;
        IDAT.name = "IDAT";
        IDAT.data = new Uint8Array(this._module.memory.buffer, data+8, SIZE);
        IDAT.view = new DataView(this._module.memory.buffer, data+8, SIZE);
        IDAT.view.setUint16(0, 0x7801, false);

        //
        this._module.makePNGData(data+8+2, this.RGBdraw(),this.w,this.h);

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

    encode(chunks, RGBdraw = ()=>{}, Adraw = null) {
        if (this.ctx) {
            this.w = this.ctx.canvas.width, this.h = this.ctx.canvas.height;
        }
        this.chunks = [...(chunks||[])].filter((C)=>{ return C.name != "IHDR" && C.name != "IDAT" && C.name != "IEND"; });
        this.RGBdraw = RGBdraw;
        this.Adraw = Adraw;
        
        // TODO: store IDAT for recoding
        this.encodeIHDR();
        (this.Adraw ? this.encodeIDAT2 : this.encodeIDAT).call(this);
        this.encodeIEND();
        
        //
        const blob = new Blob([this.PNGsignature, ...(chunks = this.chunks).map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});

        // fix memory leak
        this.chunks = [];
        this.toFree.map(this._module.free.bind(this._module));
        this.toFree = [];

        //
        return blob;
    }

    shared(imageData) {
        this.buffer = (imageData.data?.buffer || imageData.data), this.w = imageData.width, this.h = imageData.height;
        _temp.getPixelPack = (x,y,w,h,P)=>{ new Uint32Array(this._module.memory.buffer, P, w).set(new Uint32Array(this.buffer, y*w*4, w)); return P; };
        return this;
    }

    context(ctx) {
        this.ctx = ctx, this.w = ctx.canvas.width, this.h = ctx.canvas.height;
        _temp.getPixelPack = (x,y,w,h,P)=>{ new Uint8Array(this._module.memory.buffer, P, w*h*4).set(new Uint8Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return P; };
        return this;
    }
}
