import { loadBitmapThroughput, encodeSvg, loadBitmapAsBlob, encodeURL, loadImage, blobToArrayBuffer } from "./utils.js";
import { PNGChunk, BlazerPNG } from "./png.js";
import { DataReader } from "./reader.js";
import { IDBCache } from "./idb-cache.js";
import { GDI } from "./gdi.js";
import * as pako from "../pako/pako.esm.mjs";
import { OpenJNG } from "./openjng.js";

//
export class MNGImage {
    constructor(image) {
        this.bitmap = createImageBitmap(this.image = image);
    }
}

//
export class MNGObject {
    constructor(image) {
        this.image = image;
        this.canvas = new OffscreenCanvas(2, 2);
        this.ctx = this.canvas.getContext("2d");
        this.offset = [0, 0];
        this.magnification = [1, 1, 1, 1];
        this.clip = [0, 0, 0, 0];
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    async initial(image) {
        if (image) this.image = image;
        this.canvas.width = (await this.image.bitmap).width;
        this.canvas.height = (await this.image.bitmap).height;
        this.ctx.drawImage(await this.image.bitmap, 0, 0);
        return this;
    }

    async show(ctx) {
        ctx.drawImage(this.canvas, 
            this.offset[0] - (this.magnification[0]-1), 
            this.offset[1] - (this.magnification[1]-1), 
            this.canvas.width  + (this.magnification[2] + this.magnification[0] - 2), 
            this.canvas.height + (this.magnification[3] + this.magnification[1] - 2), 
            
            this.clip[0],
            this.clip[1], 
            this.canvas.width -this.clip[2],
            this.canvas.height-this.clip[3]
        );
    }
}

//
export class MNGFrame {
    constructor() {
        
    }
}

//
export class MNGInstruction {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }

    async execute() {
        return this;
    }
}

//
export class MNGProgram extends MNGInstruction {
    constructor(type = "MHDR", id = "_") {
        super(type, id);
        this.instructions = [];
    }

    async execute() {
        return this;
    }
}

//
export class MNGLoop extends MNGProgram {
    constructor(parent, lcount) {
        super("LOOP", "_");
        this.parent = parent;
        this.lcount = lcount;
    }

    async execute() {
        return this;
    }
}

//
export class OpenMNG {
    constructor() {
        //this.canvas = new OffscreenCanvas(2, 2);
        this.objects = {
            "_": new PNGObject()
        };
        this.images = [];

        this.program = new MNGProgram();
        this.current = this.program;
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
        var header = this.reader.chunks.find((chunk)=>{ return chunk.name === "MHDR"; });
        this.objects["_"].canvas.width = header.view.getUint32(0, false);
        this.objects["_"].canvas.height = header.view.getUint32(4, false);
    }
}
