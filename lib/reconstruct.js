import { encodeURL } from "./utils.js";
import { PNGChunk } from "./png.js";

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
