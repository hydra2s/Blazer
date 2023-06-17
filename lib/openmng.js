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
export class MNGInstruction {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }

    async execute(objs) {
        return this;
    }
}

//
export class MNGProgram extends MNGInstruction {
    constructor(type = "MHDR", id = "_") {
        super(type, id);
        this.instructions = [];
        this.iterator = 0;
    }

    async execute(objs) {
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

    async execute(objs) {
        return this;
    }
}

//
export class MNGDefinition extends MNGInstruction {
    constructor(id = "_") {
        super("DEFI", id);
        this.image = null;
    }

    async execute(objs) {
        return this;
    }
}

//
export class MNGClone extends MNGInstruction {
    constructor(to = "_", from = "_") {
        super("CLON", to);
        this.from = from;
    }

    async execute(objs) {
        return this;
    }
}

//
export class MNGMove extends MNGInstruction {
    constructor(id = "_") {
        super("MOVE", id);
    }

    async execute(objs) {
        return this;
    }
}

//
export class OpenPNG {
    constructor() {
        this.header = {
            width: 0,
            height: 0, 
            bitDepth: 8,
        }

        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
    }

    readHeader() {
        var header = this.reader.chunks.find((chunk)=>{ return chunk.name === "IHDR"; });
        this.header.width = header.view.getUint32(0, false);
        this.header.height = header.view.getUint32(4, false);
        //this.header.bitDepth = header.view.getUint8(12, false);
    }

    async loadInternal(reader) {
        this.reader = reader;
        this.readBody();
        return this.recodePNG();
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
    }

    async recdoePNG() {
        return new Blob([/*[this.concat(Uint8Array, JPEGc)]*/this.PNGsignature, ...this.reader.chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});
    }
}

//
export class OpenMNG {
    constructor() {
        //this.canvas = new OffscreenCanvas(2, 2);
        
        this.images = [];
        this.program = new MNGProgram();
        this.parsed = this.program;
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

    async parse() {
        let _skipping_ = false;
        for (const C of this.reader.chunks) 
        {
            switch(C.name) {
                case "LOOP":
                this.parsed.instructions.push(new MNGLoop(this.parsed, 1));
                this.parsed = this.parsed.instructions.slice(-1)[0];
                break;

                case "ENDL":
                this.parsed = this.parsed.parent;
                break;
                
                case "DEFI":
                this.parsed.instructions.push(new MNGDefinition());
                break;

                case "CLON":
                this.parsed.instructions.push(new MNGClone());
                break;

                case "MOVE":
                this.parsed.instructions.push(new MNGMove());
                break;

                // JNG!
                case "JHDR":
                    _skipping_ = true;
                    this.images.push(this.jngLoader.loadInternal(new DataReader(this.reader.data, C.slice.byteOffset)));
                    (this.parsed.instructions.slice(-1)[0]?.type == "DEFI" ? this.parsed.instructions.slice(-1)[0] : this).image = createImageBitmap(await this.images.slice(-1)[0]);
                break;

                // PNG!
                case "IHDR":
                    _skipping_ = true;
                    this.images.push(this.pngLoader.loadInternal(new DataReader(this.reader.data, C.slice.byteOffset)));
                    (this.parsed.instructions.slice(-1)[0]?.type == "DEFI" ? this.parsed.instructions.slice(-1)[0] : this).image = createImageBitmap(await this.images.slice(-1)[0]);
                break;

                //
                case "BASI":
                    _skipping_ = true;
                break;

                //
                case "IEND":
                    _skipping_ = false;
                break;

                //
                default: 
                
            }
        }
        return this;
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
        if (this.image) {
            this.canvas.width = (await this.image.bitmap).width;
            this.canvas.height = (await this.image.bitmap).height;
            this.ctx.drawImage(await this.image.bitmap, 0, 0);
        }
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

// state machine
export class MNGRenderer {
    constructor(mng) {
        this.mng = mng;
        this.objects = {
            "_": new MNGObject(this.mng.image)
        };
        this.visible = [];
        this.current = this.mng.program;
        this.nextInstruction = this.instruction = this.mng.program.instructions[0];

        //
        this.lastTime = performance.now();
        this.frameTime = 0;
    }

    async toNextInstruction() {
        (this.instruction = this.nextInstruction).execute(this);
        this.nextInstruction = this.current.instructions[++this.current.iterator];

        // TODO: handle loops
    }

    async drawObjects() {
        for (let V of this.visible) {
            this.objects[V].show();
        }

        //
        if ((performance.now() - this.lastTime) >= this.frameTime || this.nextInstruction.type != "FRAM") {
            this.toNextInstruction();
        }

        //
        return this;
    }

    //
    getCanvas() {
        return this.objects["_"].canvas;
    }
}

