import {} from "./utils.js";
import { PNGChunk } from "./png.js";

//
export class DataReader {
    constructor(data, offset = 0) {
        this.data = data;
        this.offset = offset;
        this.chunks = [];
        this.signature = null;
        this.chunk = null;
    }
    
    readSignature() {
        this.signature = new Uint8Array(this.data, this.offset, 8);
        this.offset += 8;
        this.chunk = new PNGChunk();
    }

    readLength() {
        if (!this.chunk) { this.chunk = new PNGChunk(); };
        this.chunk.length = new DataView(this.data, this.offset, 4).getUint32(0, false);
        this.offset += 4;
    }

    readName() {
        this.chunk.name = new TextDecoder().decode(new Uint8Array(this.data, this.offset, 4));
        this.offset += 4;
    }

    readCRC() {
        this.chunk.crc32 = new DataView(this.data, this.offset, 4).getUint32(0, false);
        this.offset += 4;
    }

    readData() {
        this.chunk.data = new Uint8Array(this.data, this.offset, this.chunk.length);
        this.chunk.view = new DataView(this.data, this.offset, this.chunk.length);
        this.offset += this.chunk.length;
    }

    makeSlice() {
        this.chunks.push(this.chunk);
        this.chunk.slice = new Uint8Array(this.data, this.offset-this.chunk.length-4-4-4, this.chunk.length+4+4+4);
        this.chunk = new PNGChunk();
    }
}