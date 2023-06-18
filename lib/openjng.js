import { loadBitmapThroughput, encodeSvg, loadBitmapAsBlob, encodeURL, loadImage, blobToArrayBuffer } from "./utils.js";
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
        IHDR.view.setUint8(9, /*this.header.bitDepth <= 8 ? 3 : 0*/0, false);
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
        //if (this.header.bitDepth <= 8) {
            //this.encodePLTE();
            //this.encodeTRNS();
        //}
        this.chunks.push(...this.idats);
        this.encodeIEND();
        return new Blob([/*[this.concat(Uint8Array, JPEGc)]*/this.PNGsignature, ...this.chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});
    }
}

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
        this.cache = new IDBCache();
        this.options = {
            loadBitmapThroughput,
            ...options
        };

        this.filter = typeof CanvasFilter != "undefined" ? new CanvasFilter(
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

        if (!this.filter) {
            this.gdi = new GDI();
            this.func = this.gdi.func([GDI.const(1.0), GDI.const(1.0), GDI.const(1.0), GDI.R()]);
        }
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
        if (!this.db) {
            this.db = await this.cache.open("openjng", {
                upgrade(db) {
                    const store = db.createObjectStore(location.hostname, {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                }
            });
        }

        //
        let tx = await this.db.transaction(location.hostname, "readonly");
        let cache = await tx[1].get(URL); await tx[0].done;
        //if (cache) { return new Blob([pako.inflate(new Uint8Array(await blobToArrayBuffer(cache.blob)))], {type: "image/png"}) };

        //
        this.URL = URL;
        let response = await fetch(URL, { mode: "cors", keepalive: true });
        if (response.ok) {
            this.reader = new DataReader(await response.arrayBuffer());
            this.readImage();
        } else {
            console.error("Error HTTP: " + response.status);
        }
        return this.recodePNG();
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
        //if (this.checkSignature()) {

            // kill almost instantly
            // TODO: find a way to do it in webworker better
            /*let IMAGE = new Promise(async(R)=>R(await (this.A ? loadBitmapThroughput(new Blob([`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg color-interpolation="auto" width="${this.header.width}" height="${this.header.height}" viewBox="0 0 ${this.header.width} ${this.header.height}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
<defs><mask id="mask"><image image-rendering="optimizeSpeed" style="image-rendering:pixelated" xlink:href="${await this.A}" width="${this.header.width}" height="${this.header.height}"/></mask></defs>
<image image-rendering="optimizeSpeed" style="image-rendering:pixelated" xlink:href="${await this.RGB}" width="${this.header.width}" height="${this.header.height}" mask="url(#mask)"/>
</svg>`], {type: `image/svg+xml`})) : loadBitmapAsBlob(this.RGB))));*/
            
            //
            if (!this.blazer) {
                await (this.blazer = new BlazerPNG()).init();
            }
            
            {
                let canvas = new OffscreenCanvas(this.header.width, this.header.height);
                let ctx = canvas.getContext("2d", { desynchronized: true, willReadFrequently: true });
                await this.blazer.context(ctx);
                
                //console.time("BlazePNG");

                let blob = await this.blazer.encode(this.reader.chunks.filter((C)=>C.name!="JHDR"&&C.name!="JDAA"&&C.name!="JDAT"&&C.name!="JdAA"&&C.name!="IDAT"), async (P) => {
                    ctx.clearRect(0, 0, this.header.width, this.header.height);
                    //if (this.A && this.indexedAvailable) {
                        /*ctx.beginLayer([{
                            filter: "colorMatrix",
                            type: "matrix",
                            values: [
                                0, 0, 0, 0, 1,
                                0, 0, 0, 0, 1,
                                0, 0, 0, 0, 1,
                                1, 0, 0, 0, 0
                            ],
                        }]);*/
                        ctx.globalCompositeOperation = "source-over";
                        if (this.filter) {
                            ctx.filter = this.filter;
                            ctx.drawImage(await createImageBitmap(await this.A), 0, 0);
                        } else {
                            ctx.filter = "url()";
                            ctx.drawImage(await this.gdi.image(await createImageBitmap(await this.A)).gen(this.func), 0, 0);
                        }
                        
                        //ctx.endLayer();
                        //
                    //}
                    ctx.filter = "url()";
                    ctx.globalCompositeOperation = "source-in";
                    ctx.drawImage(await createImageBitmap(await this.RGB), 0, 0);
                    ctx.globalCompositeOperation = "source-over";
                    return P;
                }, null);
                //console.timeEnd("BlazePNG");

                // store into IndexedDB cache with compression
                if (this.db) (async()=>{
                    let cm = new Blob([pako.deflate(new Uint8Array(await blobToArrayBuffer(blob)))], {type: "application/x-gzip"});
                    let tx = await this.db.transaction(location.hostname, "readwrite");
                    await tx[1].put({ "id": this.URL, "blob": cm }); await tx[0].done;
                })();

                //
                return /*URL.createObjectURL*/(blob);
            }
            
            //
            /*console.time("NativePNG");
            const blob = await (canvas.convertToBlob || canvas.toBlob).call(canvas, {type: "image/png", quality: 0});
            console.timeEnd("NativePNG");
            const FR = new FileReader();
            FR.readAsArrayBuffer(blob);
            const READ = new Promise(resolve => {
                FR.onload = ()=>resolve(FR.result);
            });
            return await new InjectPNG(this.reader.chunks, this.header).recode(await READ);*/
        //}
        return null;
    }

}
