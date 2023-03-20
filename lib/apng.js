import { swap32, loadImage } from "./utils.js";
import * as CRC32 from "../node_modules/crc-32/crc32.mjs";
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

//
export class APNGPreRender {
    constructor(width, height, frames, options) {
        this.canvas = new OffscreenCanvas(width, height);
        this.ctx = this.canvas.getContext("2d", { desynchronized: true, willReadFrequently: true });
        this.frames = frames;
        this.options = {
            fullFrame: true, 
            ...(options||{})
        };
    }

    async prerender() {
        const ctx = this.ctx, canvas = this.canvas;
        const images = await Promise.all(this.frames.map((F)=>F.image));
        let prevF = null, prevI = null;

        const P = this.frames.map((F,I)=>[F,I]);
        const Fm = [];
        for await (const p of P) {
            const [F,I] = p;
            if (I == 0) { 
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
                if (F.disposeOp == 2) F.disposeOp = 1; 
                prevF = null; 
            }

            if (prevF && prevF.disposeOp) { ctx.clearRect(prevF.left, prevF.top, prevF.width, prevF.height); }
            if (prevI && prevF && prevF.disposeOp == 2) {
                ctx.drawImage(prevI, prevF.left, prevF.top, prevF.width, prevF.height);
            }
            
            prevF = F, prevI = null;
            if (F && F.disposeOp == 2) {
                prevI = await createImageBitmap(this.canvas, F.left, F.top, F.width, F.height);
            }
            if (F.blendOp == 0) { ctx.clearRect(F.left, F.top, F.width, F.height); }
            ctx.drawImage(images[I], F.left, F.top);
            Fm.push(await createImageBitmap(this.canvas, ...(this.options.fullFrame ? [0, 0, this.canvas.width, this.canvas.height] : [F.left, F.top, F.width, F.height])));
        }
        return Fm;
    }
}

export class APNGDecoder {
    constructor() {
        
    }

    async load(url) {
        let response = await fetch(this.URL = url);
        if (response.ok) {
            this.reader = new DataReader(await response.arrayBuffer());
            this.readImage();
        } else {
            console.error("Error HTTP: " + response.status);
        }
        return this.decodeAPNG();
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

    decodeAPNG() {
        const frames = [];
        let cF = null;
        let dT = [];
        const finishF = (cF)=>{
            const reconstruct = new ReconstructPNG2(this.reader.chunks);
            cF.image = loadImage(cF.blob = reconstruct.encode(cF.width, cF.height, this.part5, dT)); dT = [];
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
        return (this.frames = frames);
    }
}

//
export class APNGEncoder {
    constructor() {
        
    }
}
