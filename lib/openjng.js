import { loadBitmapThroughput, createImageBitmapAsync, encodeSvg, loadBitmapAsBlob, encodeURL, loadImage, blobToArrayBuffer } from "./utils.js";
import { PNGChunk, BlazerPNG } from "./png.js";
import { DataReader } from "./reader.js";
import { IDBCache } from "./idb-cache.js";
import { GDI } from "./gdi.js";
import * as pako from "../pako/pako.esm.mjs";

// for JNG alpha channel
export class ReconstructPNG {
    constructor(chunks, header) {
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
        this.idats = chunks.filter((chunk)=>{
            //chunk.name != "JHDR" && 
            //chunk.name != "JDAT" && 
            //chunk.name != "JDAA" && 
            //chunk.name != "JEND"
            return chunk.name == "IDAT";
        });
        this.chunks = [];
        this.header = header;
    }

    encodePLTE() {
        var PLTE = new PNGChunk();
        var SIZE = (1<<this.header.bitDepth)*3;
        var data = new ArrayBuffer(SIZE+4+4+4);
        PLTE.length = SIZE;
        PLTE.name = "PLTE";
        PLTE.data = new Uint8Array(data, 8, SIZE);
        PLTE.view = new DataView(data, 8, SIZE);
        PLTE.data.set(new Uint8Array(SIZE).fill(255));
        PLTE.slice = new Uint8Array(data);
        this.chunks.push(PLTE.compile());
        return this;
    }

    encodeTRNS() {
        var tRNS = new PNGChunk();
        var SIZE = 1<<this.header.bitDepth;
        var data = new ArrayBuffer(SIZE+4+4+4);
        tRNS.length = SIZE;
        tRNS.name = "tRNS";
        tRNS.data = new Uint8Array(data, 8, SIZE);
        tRNS.view = new DataView(data, 8, SIZE);
        tRNS.data.set(new Uint8Array(SIZE).map((_,I)=>((Math.pow(I+1, 8/this.header.bitDepth)-1)|0)));
        tRNS.slice = new Uint8Array(data);
        this.chunks.push(tRNS.compile());
        return this;
    }

    encodeIHDR() {
        var IHDR = new PNGChunk();
        var data = new ArrayBuffer(13+4+4+4);
        IHDR.length = 13;
        IHDR.name = "IHDR";
        IHDR.data = new Uint8Array(data, 8, 13);
        IHDR.view = new DataView(data, 8, 13);
        IHDR.view.setUint32(0, this.header.width, false);
        IHDR.view.setUint32(4, this.header.height, false);
        IHDR.view.setUint8(8, this.header.bitDepth, false);
        IHDR.view.setUint8(9, this.header.bitDepth <= 8 ? 3 : 0, false);
        //IHDR.view.setUint8(10, 0, false);
        IHDR.view.setUint8(10, 0, false);
        IHDR.view.setUint8(11, this.filter, false);
        IHDR.view.setUint8(12, this.interlace, false);
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
        if (this.header.bitDepth <= 8) {
            this.encodePLTE();
            this.encodeTRNS();
        }
        this.chunks.push(...this.idats);
        this.encodeIEND();
        return new Blob([/*[this.concat(Uint8Array, JPEGc)]*/this.PNGsignature, ...this.chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});
    }
}

//
const _temp = {};
const _module = new Promise(async (R)=>{
    
    _temp.filter = typeof CanvasFilter != "undefined" ? new CanvasFilter(
        [{
            filter: "colorMatrix",
            type: "matrix",
            values: [
                0, 0, 0, 0, 1,
                0, 0, 0, 0, 1,
                0, 0, 0, 0, 1,
                1, 0, 0, 0, 0
            ],
        }]
    ) : null;

    if (!_temp.filter) {
        try { _temp.gdi = new GDI(); } catch(e) {};
        try { _temp.func = _temp.gdi.func([GDI.const(1.0), GDI.const(1.0), GDI.const(1.0), GDI.R()]); } catch(e) {};
    }

    R(_temp);
});

//
export class OpenJNG {
    constructor(options) {
        this.JNGSignature = new Uint8Array([ 0x8b, 0x4a, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a ]);
        this.header = {
            width: 0,
            height: 0, 
            bitDepth: 8,
        }
        this.alphaHeader = {
            width: 0,
            height: 0, 
            bitDepth: 8,
            filter: 0,
            compression: 0,
            interlace: 0
        }
        this.A = null;
        this.RGB = null;
        this.options = {
            loadBitmapThroughput,
            ...options
        };

        //
        this.ctx = (this.canvas = new OffscreenCanvas(2, 2)).getContext("2d", { desynchronized: true, willReadFrequently: true });
    }

    compare(a, b) {
        for (let i = a.length; -1 < i; i -= 1) {
          if ((a[i] !== b[i])) return false;
        }
        return true;
    }

    equal32(a, b) {
        const ua = new Uint32Array(a.buffer, a.byteOffset, a.byteLength / 4);
        const ub = new Uint32Array(b.buffer, b.byteOffset, b.byteLength / 4);
        return this.compare(ua, ub);
    }
    
    checkSignature() {
        return this.equal32(this.reader.signature, this.JNGSignature);
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

    readBody() {
        //
        while (this.reader.offset < this.reader.data.byteLength) {
            this.reader.readLength();
            this.reader.readName();
            this.reader.readData();
            this.reader.readCRC();
            this.reader.makeSlice();
            if (this.reader.chunks.slice(-1)[0].name == "IEND") { break; };
        }

        //
        this.readHeader();

        { this.RGB = this.concatJDAT(); }

        {
            if (this.alphaHeader.compression == 8 && this.alphaHeader.bitDepth > 0 || this.reader.chunks.find((chunk)=>{return chunk.name == "JDAA" || chunk.name == "JdAA";})) { this.A = this.concatJDAA(); } else
            if (this.alphaHeader.compression == 0 && this.alphaHeader.bitDepth > 0 || this.reader.chunks.find((chunk)=>{
                return chunk.name == "IDAT";
            })) { 
                if (this.alphaHeader.bitDepth <= 8) { this.indexedAvailable = true; };
                this.A = this.reconstructPNG();
            };
        }

        //
        return this;
    }

    readImage() {
        this.reader.readSignature();
        if (this.checkSignature()) {
            this.readBody();
        } else {
            this.reader = null;
        }
        return this;
    }
    
    readHeader() {
        var header = this.reader.chunks.find((chunk)=>{ return chunk.name === "JHDR"; });
        this.alphaHeader.width = this.header.width = header.view.getUint32(0, false);
        this.alphaHeader.height = this.header.height = header.view.getUint32(4, false);
        this.alphaHeader.bitDepth = header.view.getUint8(12, false);
        this.alphaHeader.compression = header.view.getUint8(13, false);
        this.alphaHeader.filter = header.view.getUint8(14, false);
        this.alphaHeader.interlace = header.view.getUint8(15, false);
    }
    
    async load(URL) {
        this.URL = URL;
        let response = await fetch(URL, { mode: "cors", keepalive: true });
        if (response.ok) {
            this.reader = new DataReader(await response.arrayBuffer());
            this.readImage();
        } else {
            console.error("Error HTTP: " + response.status);
        }
        return this.reader ? this.recodePNG() : null;
    }

    async loadInternal(reader) {
        this.reader = reader;
        this.readBody();
        return this.recodePNG();
    }

    async reconstructPNG() {
        return new ReconstructPNG(this.reader.chunks, this.alphaHeader).encode();
    }

    async concatJDAT() {
        var JDATs = this.reader.chunks.filter((chunk)=>{return chunk.name == "JDAT";});
        var JPEGc = JDATs.map((chunk)=>{ return chunk.data; });
        return new Blob(/*[this.concat(Uint8Array, JPEGc)]*/JPEGc, {type: "image/jpeg"});
    }

    async concatJDAA() {
        var JDATs = this.reader.chunks.filter((chunk)=>{return chunk.name == "JDAA" || chunk.name == "JdAA";});
        var JPEGc = JDATs.map((chunk)=>{ return chunk.data; });
        return new Blob(/*[this.concat(Uint8Array, JPEGc)]*/JPEGc, {type: "image/jpeg"});
    }

    async recodePNG() {

        // cross-browser support of JNG with alpha channel
        const canvas = this.canvas, ctx = this.ctx;
        const A_RGB = await Promise.all([this.RGB.then(createImageBitmap), (this.A ? this.A.then(createImageBitmap).then(async(I)=>{
            return (this.indexedAvailable || this._module.filter) ? I : (await this._module.gdi.image(I).gen(this._module.func));
        }) : null), new Promise(async(R)=>{ R(this._module = await _module); })]);

        // 
        { canvas.width = this.header.width, canvas.height = this.header.height; };
        const BLOB = (this.blazer = new BlazerPNG()).context(ctx).encode(this.reader.chunks.filter((C)=>C.name!="JHDR"&&C.name!="JDAA"&&C.name!="JDAT"&&C.name!="JdAA"&&C.name!="IDAT"), (P) => {
            ctx.save();
            ctx.clearRect(0, 0, this.header.width, this.header.height);
            ctx.globalCompositeOperation = "source-over";
            if (A_RGB[1]) {
                ctx.filter = (this.indexedAvailable || !this._module.filter) ? "url()" : this._module.filter;
                ctx.drawImage(A_RGB[1], 0, 0);
                ctx.globalCompositeOperation = "source-in";
            }
            ctx.filter = "url()";
            ctx.drawImage(A_RGB[0], 0, 0);
            ctx.restore();
            return P;
        }, null);
        //console.timeEnd("BlazePNG");

        //
        return /*URL.createObjectURL*/BLOB;
        
    }

}

