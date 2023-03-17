import { loadBitmapThroughput, encodeSvg, loadBitmapAsBlob, encodeURL, loadImage } from "./utils.js";
import { PNGChunk } from "./png.js";
import { DataReader } from "./reader.js";
import { ReconstructPNG } from "./reconstruct.js";
import { BlazerPNG } from "./png.js"

//
export class OpenJNG {
    constructor() {
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

    readImage() {
        this.reader.readSignature();
        while (this.reader.offset < this.reader.data.byteLength) {
            this.reader.readLength();
            this.reader.readName();
            this.reader.readData();
            this.reader.readCRC();
            this.reader.makeSlice();
        }
        this.readHeader();

        //
        if (this.checkSignature()) {
            this.RGB = this.concatJDAT();
            {
                if (this.alphaHeader.compression == 8 && this.alphaHeader.bitDepth > 0 || this.reader.chunks.find((chunk)=>{return chunk.name == "JDAA" || chunk.name == "JdAA";})) { this.A = this.concatJDAA(); } else
                if (this.alphaHeader.compression == 0 && this.alphaHeader.bitDepth > 0 || this.reader.chunks.find((chunk)=>{return chunk.name == "IDAT";})) { this.A = this.reconstructPNG(); };
            }
        }
        
        //
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
        let response = await fetch(URL);
        if (response.ok) {
            this.reader = new DataReader(await response.arrayBuffer());
            this.readImage();
        } else {
            console.error("Error HTTP: " + response.status);
        }
        return this;
    }

    async reconstructPNG() {
        return new ReconstructPNG(this.reader.chunks, this.alphaHeader).encode();
    }

    async concatJDAT() {
        var JDATs = this.reader.chunks.filter((chunk)=>{return chunk.name == "JDAT";});
        var JPEGc = JDATs.map((chunk)=>{ return chunk.data; });
        return (encodeURL(/*[this.concat(Uint8Array, JPEGc)]*/JPEGc, "image/jpeg"));
    }

    async concatJDAA() {
        var JDATs = this.reader.chunks.filter((chunk)=>{return chunk.name == "JDAA" || chunk.name == "JdAA";});
        var JPEGc = JDATs.map((chunk)=>{ return chunk.data; });
        return (encodeURL(/*[this.concat(Uint8Array, JPEGc)]*/JPEGc, "image/jpeg"));
    }

    async recodePNG() {
        if (this.checkSignature()) {

            // kill almost instantly
            // TODO: find a way to do it in webworker better
            let IMAGE = new Promise(async(R)=>R(await (this.A ? loadBitmapThroughput(`data:image/svg+xml,` + encodeSvg(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg color-interpolation="auto" width="${this.header.width}" height="${this.header.height}" viewBox="0 0 ${this.header.width} ${this.header.height}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
<defs><mask id="mask"><image image-rendering="optimizeSpeed" style="image-rendering:pixelated" xlink:href="${await this.A}" width="${this.header.width}" height="${this.header.height}"/></mask></defs>
<image image-rendering="optimizeSpeed" style="image-rendering:pixelated" xlink:href="${await this.RGB}" width="${this.header.width}" height="${this.header.height}" mask="url(#mask)"/>
</svg>`)) : loadBitmapAsBlob(this.RGB))));
            
            //
            if (!this.blazer) {
                await (this.blazer = new BlazerPNG()).init();
            }
            
            let canvas = null;
            {
                canvas = new OffscreenCanvas(this.header.width, this.header.height);
                var ctx = canvas.getContext("2d", { willReadFrequently: true });
                    ctx.drawImage(await IMAGE, 0, 0);
                
                //
                this.blazer.context(ctx, canvas.width, canvas.height);
                //console.time("BlazePNG");
                let blob = this.blazer.encode(this.reader.chunks.filter((C)=>C.name!="JHDR"&&C.name!="JDAA"&&C.name!="JDAT"&&C.name!="JdAA"&&C.name!="IDAT"));
                //console.timeEnd("BlazePNG");
                return loadImage(blob);
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
        }
        return null;
    }

}