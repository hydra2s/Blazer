import { swap32, blobToArrayBuffer, concat } from "./utils.js";
import * as CRC32 from "../deps/crc32.mjs";
import { _module, _temp } from "./module.js";
import { DataReader } from "./reader.js";
//import UPNG from "../pako/upng.js"

import _library_ from "./lodepng.js";
//const _lodepng_ = _library_();

/*
const rec2020  = new Uint8Array(`00 00 01 d0 6c 63 6d 73 04 20 00 00 6d 6e 74 72
52 47 42 20 58 59 5a 20 07 e5 00 04 00 1b 00 0a
00 1b 00 00 61 63 73 70 4d 53 46 54 00 00 00 00
73 61 77 73 63 74 72 6c 00 00 00 00 00 00 00 00
00 00 00 00 00 00 f6 d6 00 01 00 00 00 00 d3 2d
68 61 6e 64 b4 18 c8 ac cd dd dc 00 76 ed f1 07
5f 32 73 0d 00 00 00 00 00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
00 00 00 0a 64 65 73 63 00 00 00 fc 00 00 00 24
63 70 72 74 00 00 01 20 00 00 00 22 77 74 70 74
00 00 01 44 00 00 00 14 63 68 61 64 00 00 01 58
00 00 00 2c 72 58 59 5a 00 00 01 84 00 00 00 14
67 58 59 5a 00 00 01 98 00 00 00 14 62 58 59 5a
00 00 01 ac 00 00 00 14 72 54 52 43 00 00 01 c0
00 00 00 10 67 54 52 43 00 00 01 c0 00 00 00 10
62 54 52 43 00 00 01 c0 00 00 00 10 6d 6c 75 63
00 00 00 00 00 00 00 01 00 00 00 0c 65 6e 55 53
00 00 00 08 00 00 00 1c 00 32 00 30 00 32 00 34
6d 6c 75 63 00 00 00 00 00 00 00 01 00 00 00 0c
65 6e 55 53 00 00 00 06 00 00 00 1c 00 43 00 43
00 30 00 00 58 59 5a 20 00 00 00 00 00 00 f6 d6
00 01 00 00 00 00 d3 2d 73 66 33 32 00 00 00 00
00 01 0c 42 00 00 05 de ff ff f3 25 00 00 07 93
00 00 fd 90 ff ff fb a1 ff ff fd a2 00 00 03 dc
00 00 c0 6e 58 59 5a 20 00 00 00 00 00 00 ac 69
00 00 47 70 ff ff ff 81 58 59 5a 20 00 00 00 00
00 00 2a 6a 00 00 ac e3 00 00 07 ad 58 59 5a 20
00 00 00 00 00 00 20 03 00 00 0b ad 00 00 cb ff
70 61 72 61 00 00 00 00 00 00 00 00 00 02 66 66`.replaceAll(/(?:\r\n|\r|\n)/g, ' ').split(" ").map((e)=>parseInt(e, 16)));
*/

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
        if (!this.slice) { 
            this.slice = new Uint8Array(new ArrayBuffer(this.length+4+4+4));
            new Uint8Array(this.slice.buffer, this.slice.byteOffset+8, this.length).set(this.data);
        };
        
        var view = new DataView(this.slice.buffer, this.slice.byteOffset, this.length+4+4+4);
        view.setUint32(0, this.length, false);
        view.setUint32(4, this.name.charCodeAt(0) | (this.name.charCodeAt(1)<<8) | (this.name.charCodeAt(2)<<16) | (this.name.charCodeAt(3)<<24), true);
        view.setUint32(this.length+4+4, this.crc32 = CRC32.buf(new Uint8Array(this.slice.buffer, this.slice.byteOffset+4, this.length+4)), false);
        return this;
    }
}

//
export class InjectPNG {
    constructor(chunks, header = {}) {
        // import ancilary data 
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
        this.chunks = chunks.filter((chunk)=>{ return chunk.name != "JHDR" && chunk.name != "JDAT" && chunk.name != "JDAA" && chunk.name != "JEND" && chunk.name != "IEND" && chunk.name != "IDAT";});
        this.header = header;
    }

    inject() {
        let IHDRi = this.reader.chunks.findIndex((chunk)=>{return chunk.name == "IHDR";});
        //let IDATi = this.chunks.findIndex((chunk)=>{return chunk.name == "IDAT";});
        this.reader.chunks.splice(IHDRi+1, 0, ...this.chunks);
        return this;
    }

    recode(binPNG, byteOffset = 0, limit = 0xFFFFFFFF) {
        this.reader = new DataReader(binPNG, byteOffset);
        this.reader.readSignature();
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
        while (this.reader.offset < Math.min(this.reader.data.byteLength, (byteOffset+limit))) {
            this.reader.readLength();
            this.reader.readName();
            this.reader.readData();
            this.reader.readCRC();
            this.reader.makeSlice();
            if (this.reader.chunks.slice(-1)[0].name == "IEND") { break; };
        }

        // TODO: separate chunks
        this.reader.chunks = [...this.reader.chunks];

        /*
        const _profile_ = concat(Uint8Array, [0x49, 0x43, 0x43, 0x20, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x00, 0x00], pako.deflate(rec2020));
        const iCCP = new PNGChunk(null, "iCCP", _profile_.byteLength);
        iCCP.data = _profile_;
        iCCP.compile();
        this.reader.chunks.splice(1, 0, iCCP);*/

        // kill the sRGB chunk!? (required for rec.2020, p3, other profiles)
        this.inject();
        //this.reader.chunks = this.reader.chunks.filter((C)=>(C.name!="sRGB"));

        //
        return new Blob([this.PNGsignature, ...this.reader.chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});
    }

    encode(pixelData) {
        // make operation much faster
        return this.recode(UPNG.encode([pixelData], this.header.width, this.header.height, 0));
    }
}

// NOT FASTEST YET!
// TODO: ZLIB compression support!
export class BlazerPNG {
    constructor() {
        this.toFree = [];
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
        this.options = {
            useNative: true
        }
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

    async init() {
        if (this.options.useNative) {
            this._module ||= await _library_();
        } else {
            this._module ||= await _module;
        }
        return this;
    }

    encode(chunks, RGBdraw = ()=>{}, Adraw = null) {
        if (this.ctx) {
            this.w = (this.ctx.width || this.ctx.canvas.width), this.h = (this.ctx.height || this.ctx.canvas.height);
        }
        this.chunks = [...(chunks||[])].filter((C)=>{ return C.name != "IHDR" && C.name != "IDAT" && C.name != "IEND"; });
        this.RGBdraw = RGBdraw;
        this.Adraw = Adraw;
        
        // TODO: store IDAT for recoding
        if (this.options.useNative && this.ctx) {
            this.RGBdraw();

            //
            const _outp_ptr_ = this._module._calloc(1,4);
            const _size_ptr_ = this._module._calloc(1,4);
            const _in_ptr_ = this._module._calloc(1,(this.ctx.isU16?2:1)*this.w*this.h*4);

            //
            this.ctx.getImageData(0, 0, this.w, this.h, {
                buffer: this._module.HEAP8.buffer,
                byteOffset: this._module.HEAP8.byteOffset + _in_ptr_
            });

            //
            const _status = this._module.__Z21lodepng_encode_memoryPPhPmPKhjj16LodePNGColorTypej(_outp_ptr_, _size_ptr_, _in_ptr_, this.w, this.h, 6, this.ctx.isU16?16:8);
            const _size_v_ = new DataView(this._module.HEAP8.buffer, this._module.HEAP8.byteOffset + _size_ptr_).getUint32(0, true);
            const _outp_v_ = new DataView(this._module.HEAP8.buffer, this._module.HEAP8.byteOffset + _outp_ptr_).getUint32(0, true);
            const _png_ = new Uint8Array(this._module.HEAP8.buffer, this._module.HEAP8.byteOffset + _outp_v_, _size_v_);
            const _inject_ = new InjectPNG(this.chunks, {width: this.w, height: this.h}).recode( _png_.buffer, _png_.byteOffset, _png_.byteLength );

            // free a WASM memory
            this._module._free(_in_ptr_);
            this._module._free(_outp_v_);
            this._module._free(_size_ptr_);
            this._module._free(_outp_ptr_);

            //  
            return _inject_;
        } else {
            this.encodeIHDR();
            (this.Adraw ? this.encodeIDAT2 : this.encodeIDAT).call(this);
            this.encodeIEND();
        }
        
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
        this.ctx = ctx, this.w = ctx.width || ctx.canvas.width, this.h = ctx.height || ctx.canvas.height;
        _temp.getPixelPack = (x,y,w,h,P)=>{ new Uint8Array(this._module.memory.buffer, P, w*h*4).set(new Uint8Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return P; };
        return this;
    }
}
