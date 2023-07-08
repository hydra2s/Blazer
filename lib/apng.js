import { swap32, createDOMCanvas, loadImage, loadImageBitmap } from "./utils.js";
import * as CRC32 from "../deps/crc32.mjs";
import { PNGChunk } from "./png.js";
import { DataReader } from "./reader.js";

//
export class APNGFrame {
    constructor(data) {
        Object.assign(this, data);
    }
}

//
export class APNGControl {
    constructor(data) {
        Object.assign(this, data);
    }
}

// new, for APNG support
export class PNGChunkView {
    constructor(name="IEND",length=0) {
        this.length = length;
        this.name = name;
        this.crc32 = 0;
        this.parts = [];
    }

    compile(...parts) {
        let C = CRC32.str(this.name);
        for (const P of parts) { C = CRC32.buf(P, C); };
        this.parts = [
            new Uint32Array([
                swap32(this.length), 
                this.name.charCodeAt(0) | (this.name.charCodeAt(1)<<8) | (this.name.charCodeAt(2)<<16) | (this.name.charCodeAt(3)<<24)
            ]), 
            ...parts, 
            new Uint32Array([swap32(C)])
        ];
        this.crc32 = C;
        return this;
    }
}

// for JNG alpha channel
export class ReconstructPNG2 {
    constructor(chunks, header) {
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
        this.chunks = chunks.filter((C)=>{
            return ["IHDR", "IDAT", "fdAT", "fcTL", "acTL", "IEND"].indexOf(C.name) < 0;
        });
        this.header = header;
        this.parts = this.chunks.map((C)=>C.slice);
    }

    encodeIHDR(width, height, part5) {
        var IHDR = new PNGChunk();
        var data = new ArrayBuffer(13+4+4+4);
        IHDR.length = 13;
        IHDR.name = "IHDR";
        IHDR.data = new Uint8Array(data, 8, 13);
        IHDR.view = new DataView(data, 8, 13);
        IHDR.view.setUint32(0, width, false);
        IHDR.view.setUint32(4, height, false);
        new Uint8Array(data, 16, 5).set(part5);
        IHDR.slice = new Uint8Array(data);
        this.chunks.splice(0, 0, IHDR.compile());
        this.parts.splice(0, 0, IHDR.slice);
        return this;
    }

    encodeIEND() {
        var IEND = new PNGChunk();
        var data = new ArrayBuffer(0+4+4+4);
        IEND.length = 0;
        IEND.slice = new Uint8Array(data);
        IEND.name = "IEND";
        this.chunks.push(IEND.compile());
        this.parts.push(IEND.slice);
        return this;
    }

    encodeIDAT(chunks) {
        this.parts.push(...chunks.flatMap((C)=>{
            if (C.name == "fdAT") {
                const view = new PNGChunkView("IDAT", C.length-4);
                return view.compile(new Uint8Array(C.view.buffer, C.view.byteOffset+4, C.view.byteLength-4)).parts;
            }
            if (C.name == "IDAT") {
                return C.slice;
            }
        }));
        return this;
    }

    encode(width, height, part5, chunks) {
        this.encodeIHDR(width, height, part5);
        this.encodeIDAT(chunks);
        this.encodeIEND();
        return new Blob([/*[this.concat(Uint8Array, JPEGc)]*/this.PNGsignature, ...this.parts], {type: "image/png"});
    }
}

// for simpler animations
export class APNGPreRender {
    constructor(width, height, frames, options) {
        this.canvas = new OffscreenCanvas(width, height);
        this.frames = frames;
        this.options = {
            fullFrame: true, 
            createProxyCanvas: (W,H,I)=>[I,I],
            ...options
        };
    }

    async prerender() {
        const canvas = await this.canvas;
        const ctx = canvas.getContext("2d", { 
            desynchronized: true, 
            willReadFrequently: true, 
            colorSpace: "srgb",
            colorType: "float16",
            storageFormat: "float16",
            pixelFormat: "float16",
        });
        const P = await Promise.all(this.frames.map(async (F,I)=>[await F, I]));
        const Fm = await Promise.all(P.map(([F,I])=>createImageBitmap(F.blob, {
            colorSpaceConversion: "none",
            resizeQuality: "pixelated"
        })));
        let prevF = null, prevI = null;
        
        for await (const p of P) {
            const [F,I] = p;

            if (I == 0) { 
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                if (F.disposeOp == 2) F.disposeOp = 1; 
                prevF = null; 
            }

            if (prevF && prevF.disposeOp) { ctx.clearRect(prevF.left, prevF.top, prevF.width, prevF.height); }
            if (prevI && prevF && prevF.disposeOp == 2) {
                ctx.drawImage(await prevI, prevF.left, prevF.top, prevF.width, prevF.height);
            }
            
            prevF = F, prevI = null;
            if (F && F.disposeOp == 2) {
                prevI = createImageBitmap(canvas, F.left, F.top, F.width, F.height, {
                    colorSpaceConversion: "none",
                    resizeQuality: "pixelated"
                });
            }
            if (F.blendOp == 0) { ctx.clearRect(F.left, F.top, F.width, F.height); }
            ctx.drawImage(Fm[I], F.left, F.top);
            //ctx.drawImage(await createImageBitmap(F.blob), F.left, F.top);

            // replace a image frame by bitmap
            Fm[I] = createImageBitmap(canvas, ...(this.options.fullFrame ? [0, 0, canvas.width, canvas.height] : [F.left, F.top, F.width, F.height]), {
                colorSpaceConversion: "none",
                resizeQuality: "pixelated"
            });
        }
        return Fm;
    }
}

//
export class APNGDecoder {
    constructor() {
        
    }

    async load(url) {
        let response = await fetch(this.URL = url, { mode: "cors", keepalive: true });
        if (response.ok) {
            this.reader = new DataReader(await response.arrayBuffer());
            this.readImage();
        } else {
            console.error("Error HTTP: " + response.status);
        }

        return this.parse();
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
    }

    readHeader() {
        var header = this.reader.chunks.find((chunk)=>{ return chunk.name === "IHDR"; });
        this.width = header.view.getUint32(0, false);
        this.height = header.view.getUint32(4, false);
        this.part5 = new Uint8Array(header.slice.buffer, header.slice.byteOffset+16, 5);
    }

    parse() {
        const frames = [];
        let cF = null;
        let dT = [];
        const finishF = (cF)=>{
            const reconstruct = new ReconstructPNG2(this.reader.chunks);
            cF.blob = reconstruct.encode(cF.width, cF.height, this.part5, dT); dT = [];
            frames.push(cF);
        }
        for (const C of this.reader.chunks) 
        {
            switch(C.name) {
                case "acTL":
                    this.acTL = new APNGControl({
                        numFrames: C.view.getUint32(0, false),
                        numPlays: C.view.getUint32(4, false)
                    });
                break;

                case "fcTL":
                    if (cF) finishF(cF);
                    cF = new APNGFrame({
                        width: C.view.getUint32(4, false),
                        height: C.view.getUint32(8, false),
                        left: C.view.getUint32(12, false),
                        top: C.view.getUint32(16, false),
                        delayNum: C.view.getUint16(20, false),
                        delayDen: C.view.getUint16(22, false),
                        disposeOp: C.view.getUint8(24),
                        blendOp: C.view.getUint8(25),
                    });
                break;

                case "fdAT":
                    dT.push(C);
                break;

                case "IDAT":
                    if (cF) dT.push(C);
                break;

                case "IEND":
                    if (cF) finishF(cF);
                break;
            }
        }
         (this.frames = frames);
         
         return frames;
    }
}

//
export class APNGEncoder {
    constructor() {
        
    }
}
