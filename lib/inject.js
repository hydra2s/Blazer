import {} from "./utils.js";
import { PNGChunk } from "./png.js";

// UNUSED!
class InjectPNG {
    constructor(chunks, header) {
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

    recode(binPNG) {
        this.reader = new DataReader(binPNG);
        this.reader.readSignature();
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
        while (this.reader.offset < this.reader.data.byteLength) {
            this.reader.readLength();
            this.reader.readName();
            this.reader.readData();
            this.reader.readCRC();
            this.reader.makeSlice();
        }

        // TODO: separate chunks
        this.reader.chunks = this.reader.chunks.filter((chunk)=>{
            return chunk.name == "IHDR" || chunk.name == "IDAT" || chunk.name == "IEND";
        });
        this.inject();
        
        //
        return loadImage(encodeURL([this.PNGsignature, ...this.reader.chunks.map((chunk)=>{
            return chunk.slice;
        })], "image/png", true));
    }

    encode(pixelData) {
        // make operation much faster
        return this.recode(UPNG.encode([pixelData], this.header.width, this.header.height, 0));
    }
}