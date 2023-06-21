import { loadBitmapThroughput, encodeSvg, loadBitmapAsBlob, encodeURL, loadImage, blobToArrayBuffer } from "./utils.js";
import { PNGChunk, BlazerPNG } from "./png.js";
import { DataReader } from "./reader.js";
import { IDBCache } from "./idb-cache.js";
import { GDI } from "./gdi.js";
import * as pako from "../pako/pako.esm.mjs";
import { OpenJNG } from "./openjng.js";

//
export class MNGInstruction {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }

    apply(objs) {
        return this;
    }

    draw() {
        return this;
    }
}

//
export class MNGLoop extends MNGInstruction {
    constructor(parent, lcount = -1, type = "LOOP", id = 0) {
        super(type, id);
        this.instructions = [];
        this.iterator = (this.seek = 0);
        this.literator = 0;
        this.lcount = lcount;
        this.parent = parent;
    }

    // TODO: termination support
    apply(objs) {
        objs.current = this;
        return this;
    }

    get peek() {
        return this.instructions[this.iterator];
    }
}

//
export class MNGMove extends MNGInstruction {
    constructor(id = 0) {
        super("MOVE", id);
        this._ = [0, 0];
    }

    apply(objs) {
        const _obj_  = objs.objects[this.id];
        if (this.mode) {
            _obj_.shifting.position[0] += this.x;
            _obj_.shifting.position[1] += this.y;
        } else {
            _obj_.shifting.position[0] = this.x;
            _obj_.shifting.position[1] = this.y;
        }
        return this;
    }

    set [0](_){ return this._[0] = _; };
    set [1](_){ return this._[1] = _; };

    set x(_){ return this._[0] = _; };
    set y(_){ return this._[1] = _; };

    get [0](){ return this._[0]; };
    get [1](){ return this._[1]; };

    get x(){ return this._[0]; };
    get y(){ return this._[1]; };
}

// TODO: full support for CLIP
export class MNGClip extends MNGInstruction {
    constructor(id = 0) {
        super("CLIP", id);
    }

    apply(objs) {
        return this;
    }
}

//
export class MNGShow extends MNGInstruction {
    constructor(id = 0) {
        super("SHOW", id);
        this.mode = 0;
    }

    show(objs) {
        const ctx = objs.ctx;
        ctx.save();
        objs.doClip();

        //
        ctx.clearRect(0, 0, objs.mng.width, objs.mng.height);
        for (let V of objs.visible) {
            objs.objects[V].draw(ctx);
        }

        //
        ctx.restore();
        return this;
    }

    apply(objs) {
        const _obj_ = objs.objects[this.id];
        objs.lastTime = performance.now();
        
        if (this.mode == 0) {
            _obj_.doNotShow = false;
            objs.visible.push(this.id);
        }

        if (this.mode == 1) {
            _obj_.doNotShow = true;
        }

        if (objs.visible.indexOf(this.id) >= 0) {
            if (this.mode == 1) {
                objs.visible.splice(objs.visible.indexOf(this.id), 1);
            }
        }

        //
        this.show(objs);
        return this;
    }
}

// TODO: correct working of SEEK/SAVE chunks!
export class MNGClear extends MNGInstruction {
    constructor(id = 0) {
        super("BACK", id);
        this.mode = 0;
    }

    show(objs) {
        const ctx = objs.ctx;
        ctx.clearRect(0, 0, objs.mng.width, objs.mng.height);
        return this;
    }

    apply(objs) {
        this.show(objs);
        return this;
    }
}

//
export class MNGShifting extends MNGInstruction {
    constructor(id = 0) {
        super("SHFT", id);
        this.position = new MNGMove(id);
        this.doNotShow = false;
    }
}

//
export class MNGInitial extends MNGInstruction {
    constructor(id = 0) {
        super("INIT", id);
        this.position = new MNGMove(id);
        this.doNotShow = false;
    }
}

// is draw instruction!
export class MNGImage extends MNGShow {
    constructor(id = 0, parent) {
        super(id);
        this.position = new MNGMove(id);
        this.parent = parent;
        this.data = null;
    }

    show(objs) {
        const ctx = objs.ctx;

        //
        ctx.save();
        objs.doClip();
        this.draw(ctx);
        ctx.restore();

        //
        return this;
    }

    //
    draw(ctx) {
        if (!this.parent.doNotShow) {
            const shifting = this.parent.shifting;
            ctx.drawImage(this.data, this.position.x + shifting.position.x, this.position.y + shifting.position.y);
        }
        return this;
    }

    //
    apply(objs) {
        objs.lastTime = performance.now();
        const ptr = (this.parent = objs.objects[this.id]);
        if (ptr.images.indexOf(this) < 0) {
            this.position.x = ptr.position.x;
            this.position.y = ptr.position.y;
            ptr.images.push(this);
        }
        this.show(objs);
        return this;
    }
}

//
export class MNGObject extends MNGInstruction {
    constructor(id = 0) {
        super("DEFI", id);
        this.images = [];

        // dynamic and initial state
        this.shifting = new MNGShifting(id);
        this.initial = new MNGInitial(id);

        // current state
        this.position = new MNGMove(id);
        this.doNotShow = false;
    }

    draw(ctx) {
        for (const _obj_ of this.images) {
            _obj_.draw(ctx);
        }
        return this;
    }

    apply(objs) {
        {   // TODO: correct handling initial state
            this.images = []; 
            this.position.x = this.initial.position.x, this.position.y = this.initial.position.y; 
            objs.objects[this.id] = this;
        };
        if (!this.doNotShow && objs.visible.indexOf(this.id) < 0) { objs.visible.push(this.id); };
        return this;
    }
}

//
export class MNGClone extends MNGInstruction {
    constructor(to = 0, from = 0) {
        super("CLON", to);
        this.from = from;
    }

    apply(objs) {
        return this;
    }
}


//
export class MNGFrame extends MNGInstruction {
    constructor() {
        super("FRAM", 0);
        //this.clip = [0,0,0,0];
        this.interframeDelay = 0;
        this.timeout = 65536*256;
        this.clip = null;
    }

    apply(objs) {
        objs.lastTime = performance.now();
        objs.frame = this; // reuse framing
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
        this.global = null;
    }

    with(global) {
        this.global = global;
        return this;
    }

    readHeader() {
        var header = this.reader.chunks.find((chunk)=>{ return chunk.name === "IHDR"; });
        this.header.width = header.view.getUint32(0, false);
        this.header.height = header.view.getUint32(4, false);
        this.header.bitDepth = header.view.getUint8(12, false);
        this.header.colorType = header.view.getUint8(13, false);
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
        // add global palette
        if (this.colorType = 3 && !this.reader.chunks.find((C)=>(C.name == "PLTE"))) {
            this.reader.chunks.splice(1, 0, ...this.global);
        }

        //
        return new Blob([/*[this.concat(Uint8Array, JPEGc)]*/this.PNGsignature, ...this.reader.chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});
    }
}

// TODO: Clipping support!
// TODO: Magnification support!
// TODO: Delta support are needed!!!
// TODO: Delta currently not supported!!!
export class OpenMNG extends MNGObject {
    constructor() {
        super(0);

        //
        this.program = new MNGLoop();
        this.parsed = this.program;

        //
        this.jngLoader = new OpenJNG();
        this.pngLoader = new OpenPNG();

        //
        this.global = [];
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
        let _show_ = new MNGShow();
        let _clip_ = new MNGClip();
        let _move_ = new MNGMove();
        let _defi_ = this;
        let _image_ = null;
        let _fram_ = new MNGFrame(  );

        //
        this.parsed.instructions.push(new MNGClear());
        this.parsed.instructions.push(_defi_);

        //
        for (const C of this.reader.chunks) 
        {
            switch(C.name) {
                case "PLTE":
                if (!_skipping_) {
                    this.global.push(C);
                }
                break;

                case "tRNS":
                if (!_skipping_) {
                    this.global.push(C);
                }
                break;

                case "SEEK":
                    this.parsed.instructions.push(new MNGClear());
                    this.parsed.seek = this.parsed.instructions.length;
                break;

                case "LOOP":
                    this.parsed.instructions.push(new MNGLoop(this.parsed, C.view.getUint32(1, false)));
                    this.parsed = this.parsed.instructions.slice(-1)[0];
                break;

                case "ENDL":
                    this.parsed = this.parsed.parent;
                break;
                
                case "DEFI":
                    _defi_ = new MNGObject(C.view.byteLength >= 2 ? C.view.getUint16(0, false) : 0);
                    if (C.view.byteLength >= 4) {
                        _defi_.doNotShow = C.view.getUint8(2, false);
                        _defi_.concrete = C.view.getUint8(3, false);
                    } else {
                        _defi_.doNotShow = false;
                    }
                    if (C.view.byteLength >= 12) {
                        _defi_.initial.position[0] = C.view.getInt32(4, false);
                        _defi_.initial.position[1] = C.view.getInt32(8, false);
                    }
                    if (C.view.byteLength >= 28) {
                        //_defi_.initial.clip = [C.view.getUint32(12, false), C.view.getUint32(16, false), C.view.getUint32(20, false), C.view.getUint32(24, false)];
                    } else {
                        //_defi_.initial.clip = [0, 0, 0, 0];
                    }
                    this.parsed.instructions.push(_defi_);
                break;

                case "CLON":
                    this.parsed.instructions.push(new MNGClone(C.view.getUint16(2, false), C.view.getUint16(0, false)));
                break;

                case "SHOW":
                    _show_ = new MNGShow(C.view.getUint16(0, false));
                    if (C.view.byteLength >= 4) {
                        _show_.last = C.view.getUint16(2, false);
                    }
                    if (C.view.byteLength >= 5) {
                        _show_.mode = C.view.getUint8(4, false);
                    }
                    this.parsed.instructions.push(_show_);
                break;

                case "CLIP":
                    _clip_ = new MNGClip(C.view.getUint16(0, false));
                    _clip_.last = C.view.getUint16(2, false);
                    _clip_.mode = C.view.getUint8(4, false);
                    _clip_.clip = [C.view.getUint32(5, false), C.view.getUint32(9, false), C.view.getUint32(13, false), C.view.getUint32(17, false)];
                    this.parsed.instructions.push(_clip_);
                break;

                case "MOVE":
                    _move_ = new MNGMove(C.view.getUint16(0, false));
                    _move_.last = C.view.getUint16(2, false);
                    _move_.mode = C.view.getUint8(4, false);
                    _move_._ = [C.view.getInt32(5, false), C.view.getInt32(9, false)];
                    this.parsed.instructions.push(_move_);
                break;

                case "FRAM":
                    _fram_ = new MNGFrame(  );

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
                    _image_ = new MNGImage(_defi_.id, _defi_);
                    _image_.data = await createImageBitmap(await this.jngLoader.loadInternal(new DataReader(this.reader.data, C.slice.byteOffset)));
                    this.parsed.instructions.push(_image_);
                break;

                // PNG!
                case "IHDR":
                    _skipping_ = true;
                    _image_ = new MNGImage(_defi_.id, _defi_);
                    _image_.data = await createImageBitmap(await this.pngLoader.with(this.global).loadInternal(new DataReader(this.reader.data, C.slice.byteOffset)));
                    this.parsed.instructions.push(_image_);
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
                    let _mend_ = new MNGShow(0);
                    _mend_.mode = 0;
                    _mend_.last = 0;
                    this.parsed.instructions.push(_mend_);
                break;*/

                //
                default: 
                
            }
        }
        return this;
    }
}

// state machine
export class MNGRenderer {
    constructor(mng) {
        
        this.objects = {
            [0]: (this.mng = mng)
        };

        //
        this.visible = [0];
        this.current = this.mng.program;
        this.frame = null;

        //
        this.lastTime = performance.now();

        //
        this.canvas = new OffscreenCanvas(this.mng.width, this.mng.height);
        this.ctx = this.canvas.getContext("2d");
    }

    toNextInstruction() {
        
        (this.instruction = this.current.instructions[this.current.iterator++]).apply(this);
        if (this.current.iterator >= this.current.instructions.length) {
            this.current.iterator = this.current.seek;
            while ((++this.current.literator) >= (this.current.lcount) && this.current.lcount >= 0) {
                this.current.literator = 0;
                this.current = this.current.parent;
            }
        }

        return this;
    }

    //
    doClip() {
        const ctx = this.ctx;
        if (this.frame?.clip) {
            ctx.beginPath();
            ctx.rect(this.frame.clip[0], this.frame.clip[2], this.frame.clip[1]-this.frame.clip[0], this.frame.clip[3]-this.frame.clip[2]);
            ctx.clip();
        }
    }

    //
    drawObjects() {
        //let _isDraw_ = (this.current?.peek && this.current.peek?.type == "SHOW");
        let _isDraw_ = (!this.instruction || this.instruction?.type == "SHOW");
        do {
            if ( _isDraw_ && (performance.now() - this.lastTime) <= Math.max(this.frame?.interframeDelay || 0, 32) ) { break; };
            this.toNextInstruction();
        }
        while (!(_isDraw_ = (!this.instruction || this.instruction?.type == "SHOW")));
        //while (_isDraw_ = (this.current?.peek && this.current.peek?.type == "SHOW"));
        return this;
    }

    //
    getCurrentFrame() {
        return createImageBitmap(this.getCanvas());
    }

    //
    getCanvas() {
        return this.canvas;
    }
}
