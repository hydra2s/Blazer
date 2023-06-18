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

    execute(objs) {
        return this;
    }
}

//
export class MNGLoop extends MNGInstruction {
    constructor(parent, lcount = -1, type = "LOOP", id = "_") {
        super(type, id);
        this.instructions = [];
        this.iterator = (this.seek = 0);
        this.literator = 0;
        this.lcount = lcount;
        this.parent = parent;
    }

    // TODO: termination support
    execute(objs) {
        objs.current = this;
        return this;
    }

    get peek() {
        return this.instructions[this.iterator];
    }
}

//
export class MNGDefinition extends MNGInstruction {
    constructor(id = "_") {
        super("DEFI", id);
        this.image = null;
    }

    execute(objs) {
        let _obj_ = new MNGObject(this.image);
        _obj_.clip = this.clip || _obj_.clip;
        _obj_.offset = this.offset || _obj_.offset;
        _obj_.doNotShow = _obj_.doNotShow;
        _obj_.initial();
        
        objs.objects[this.id] = _obj_;
        if (!_obj_.doNotShow) { objs.visible.push(this.id); };
        return this;
    }
}

//
export class MNGClone extends MNGInstruction {
    constructor(to = "_", from = "_") {
        super("CLON", to);
        this.from = from;
    }

    execute(objs) {
        return this;
    }
}

//
export class MNGClip extends MNGInstruction {
    constructor(id = "_") {
        super("CLIP", id);
    }

    execute(objs) {
        return this;
    }
}

//
export class MNGMove extends MNGInstruction {
    constructor(id = "_") {
        super("MOVE", id);
    }

    execute(objs) {
        if (this.mode) {
            objs.objects[this.id].offset[0] += this.offset[0];
            objs.objects[this.id].offset[1] += this.offset[1];
        } else {
            objs.objects[this.id].offset[0] = this.offset[0];
            objs.objects[this.id].offset[1] = this.offset[1];
        }
        return this;
    }
}

//
export class MNGFrame extends MNGInstruction {
    constructor() {
        super("FRAM", "_");
        //this.clip = [0,0,0,0];
        this.timeout = 65536*256;
    }

    execute(objs) {
        objs.frameTime = this.interframeDelay;
        objs.clip = this.clip;
        objs.timeout = this.timeout;
        
        return this;
    }
}

//
export class MNGShow extends MNGInstruction {
    constructor(id = "_") {
        super("SHOW", id);
        this.mode = 0;
    }

    execute(objs) {
        objs.lastTime = performance.now();
        
        if (this.mode == 0) {
            objs.objects[this.id].doNotShow = false;
            objs.visible.push(this.id);
        }

        if (this.mode == 1) {
            objs.objects[this.id].doNotShow = true;
        }

        if (objs.visible.indexOf(this.id) >= 0) {
            if (this.mode == 1) {
                objs.visible.splice(objs.visible.indexOf(this.id), 1);
            }
        }

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
        this.reader.chunks = [];
        while (this.reader.offset < this.reader.data.byteLength) {
            this.reader.readLength();
            this.reader.readName();
            this.reader.readData();
            this.reader.readCRC();
            this.reader.makeSlice();
            if (this.reader.chunks.slice(-1)[0].name == "IEND") { break; };
        }
    }

    async recodePNG() {
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
        this.program = new MNGLoop();
        this.parsed = this.program;

        //
        this.jngLoader = new OpenJNG();
        this.pngLoader = new OpenPNG();
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
        this.width = header.view.getUint32(0, false);
        this.height = header.view.getUint32(4, false);
    }

    async parse() {
        let _skipping_ = false;
        for (const C of this.reader.chunks) 
        {
            switch(C.name) {
                case "SEEK":
                    this.parsed.seek = this.parsed.instructions.length-1;
                break;

                case "LOOP":
                    this.parsed.instructions.push(new MNGLoop(this.parsed, C.view.getUint32(1, false)));
                    this.parsed = this.parsed.instructions.slice(-1)[0];
                break;

                case "ENDL":
                    this.parsed = this.parsed.parent;
                break;
                
                case "DEFI":
                    let _defi_ = new MNGDefinition(C.view.byteLength >= 2 ? C.view.getUint16(0, false) : 0);
                    if (C.view.byteLength >= 4) {
                        _defi_.doNotShow = C.view.getUint8(2, false);
                        _defi_.concrete = C.view.getUint8(3, false);
                    }
                    if (C.view.byteLength >= 12) {
                        _defi_.offset = [C.view.getInt32(4, false), C.view.getInt32(8, false)];
                    } else {
                        _defi_.offset = [0, 0];
                    }
                    if (C.view.byteLength >= 28) {
                        _defi_.clip = [C.view.getUint32(12, false), C.view.getUint32(16, false), C.view.getUint32(20, false), C.view.getUint32(24, false)];
                    } else {
                        _defi_.clip = [0, 0, 0, 0];
                    }
                    this.parsed.instructions.push(_defi_);
                break;

                case "CLON":
                    this.parsed.instructions.push(new MNGClone(C.view.getUint16(2, false), C.view.getUint16(0, false)));
                break;

                case "SHOW":
                    let _show_ = new MNGShow(C.view.getUint16(0, false));
                    if (C.view.byteLength >= 4) {
                        _show_.last = C.view.getUint16(2, false);
                    }
                    if (C.view.byteLength >= 5) {
                        _show_.mode = C.view.getUint8(4, false);
                    }
                    this.parsed.instructions.push(_show_);
                break;

                case "CLIP":
                    let _clip_ = new MNGClip(C.view.getUint16(0, false));
                    _clip_.last = C.view.getUint16(2, false);
                    _clip_.mode = C.view.getUint8(4, false);
                    _clip_.clip = [C.view.getUint32(5, false), C.view.getUint32(9, false), C.view.getUint32(13, false), C.view.getUint32(17, false)];
                    this.parsed.instructions.push(_clip_);
                break;

                case "MOVE":
                    let _move_ = new MNGMove(C.view.getUint16(0, false));
                    _move_.last = C.view.getUint16(2, false);
                    _move_.mode = C.view.getUint8(4, false);
                    _move_.offset = [C.view.getInt32(5, false), C.view.getInt32(9, false)];
                    this.parsed.instructions.push(_move_);
                break;

                case "FRAM":
                    let _fram_ = new MNGFrame(  );

                    let _txt_ = "", _char_ = 0, _I_ = 1; while (_char_ = C.view.getUint8(_I_++) != 0) {  };
                    _fram_.changeInterframeDelay = C.view.getUint8(_I_+0);
                    _fram_.changeTimeoutAndTermination = C.view.getUint8(_I_+1);
                    _fram_.changeLayerClipping = C.view.getUint8(_I_+2);
                    _fram_.changeSyncId = C.view.getUint8(_I_+3);

                    _I_ += 4;

                    if (_fram_.changeInterframeDelay) {
                        _fram_.interframeDelay = C.view.getUint32(_I_, false); _I_+=4;
                    }

                    if (_fram_.changeTimeoutAndTermination) {
                        _fram_.timeout = C.view.getUint32(_I_, false); _I_+=4;
                    }

                    if (_fram_.changeLayerClipping) {
                        _fram_.layerClippingMode = C.view.getUint8(_I_, false);
                        _fram_.clip = [
                            C.view.getUint32(_I_+1, false),
                            C.view.getUint32(_I_+5, false),
                            C.view.getUint32(_I_+9, false),
                            C.view.getUint32(_I_+13, false)
                        ];
                        _I_+=17;
                    }
                    
                    if (_fram_.changeSyncId) {
                        _fram_.syncId = C.view.getUint8(_I_, false); _I_+=1;
                    }


                    this.parsed.instructions.push(_fram_);
                break;

                // TODO: PAST support
                

                // JNG!
                case "JHDR":
                    _skipping_ = true;
                    this.images.push( this.jngLoader.loadInternal(new DataReader(this.reader.data, C.slice.byteOffset)));
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
                /*case "MEND":
                    let _mend_ = new MNGShow("_");
                    _mend_.mode = 0;
                    _mend_.last = "_";
                    this.parsed.instructions.push(_mend_);
                break;*/

                //
                default: 
                
            }
        }
        console.log(this.parsed);
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
        this.doNotShow = 0;
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    async initial(image, resize = true) {
        if (image) this.image = image;
        const _image_ = await this.image;
        if (_image_) {
            if (resize && (this.canvas.width != _image_.width || this.canvas.height != _image_.height)) {
                this.canvas.width = _image_.width;
                this.canvas.height = _image_.height;
            }
            if (!this.clip[1]) { this.clip[1] = this.canvas.width; };
            if (!this.clip[3]) { this.clip[3] = this.canvas.height; };
            this.ctx.drawImage(_image_, 0, 0);
        }
        return this;
    }

    async show(ctx) {
        /*ctx.beginPath();
        ctx.rect(this.clip[0], this.clip[2], this.clip[1], this.clip[3]);
        ctx.clip();*/

        if (!this.doNotShow) {
            ctx.drawImage(this.canvas, 
                this.clip[0],
                this.clip[2], 
                this.clip[1],
                this.clip[3],

                this.offset[0] - (this.magnification[0]-1), 
                this.offset[1] - (this.magnification[1]-1), 
                this.canvas.width  + (this.magnification[1] + this.magnification[0] - 2), 
                this.canvas.height + (this.magnification[3] + this.magnification[2] - 2), 
            );
        }
        
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
        
        //
        this.lastTime = performance.now();
        this.frameTime = 0;
        this.timeout = 65536*256;

        //
        //var header = this.mng.reader.chunks.find((chunk)=>{ return chunk.name === "MHDR"; });
        
        this.objects["_"].canvas.width = this.mng.width;
        this.objects["_"].canvas.height = this.mng.height;
        this.objects["_"].doNotShow = false;

        //
        //(this.instruction = this.current.instructions[this.current.iterator++])?.execute(this);
    }

    toNextInstruction() {
        
        if (this.current.iterator >= this.current.instructions.length) {
            this.current.iterator = this.current.seek;
            while ((++this.current.literator) >= (this.current.lcount) && this.current.lcount >= 0) {
                this.current.literator = 0;
                this.current = this.current.parent;
            }
        }
        (this.instruction = this.current.instructions[this.current.iterator++])?.execute(this);

        return this;
    }

    //
    async drawObjects() {
        let _isNotShow_ = (this.current?.peek && this.current.peek?.type != "SHOW");
        do {
            if ((performance.now() - this.lastTime) < this.frameTime) { break; };
            this.toNextInstruction();
        } while (_isNotShow_ = (this.current?.peek && this.current.peek?.type != "SHOW"));

        //
        if (!_isNotShow_) 
        {
            this.objects["_"].ctx.save();

            //
            if (this.clip) {
                this.objects["_"].ctx.beginPath();
                this.objects["_"].ctx.rect(this.clip[0], this.clip[2], this.clip[1]-this.clip[0], this.clip[3]-this.clip[2]);
                this.objects["_"].ctx.clip();
            } else {
                this.objects["_"].ctx.beginPath();
                this.objects["_"].ctx.rect(0, 0, this.mng.width, this.mng.height);
                this.objects["_"].ctx.clip();
            }

            //
            this.objects["_"].ctx.clearRect(0, 0, this.mng.width, this.mng.height);
            await this.objects["_"].initial(null, false);

            //
            for (let V of this.visible) {
                if (V == "_") continue; // skip main frame
                this.objects[V].show(this.objects["_"].ctx);
            }

            //
            this.objects["_"].ctx.restore();
        }

        //
        return this;
    }

    //
    getCurrentFrame() {
        return createImageBitmap(this.getCanvas());
    }

    //
    getCanvas() {
        return this.objects["_"].canvas;
    }
}

