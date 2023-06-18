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

    async execute(objs) {
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
    async execute(objs) {
        objs.current = this;
        return this;
    }

    get peek() {
        return this.instructions[this.iterator];
    }
}



//
export class MNGImage extends MNGInstruction {
    constructor(parent) {
        super("SHOW", "_");
        this.mode = 0;

        //
        this.parent = parent;
        this.viewable = true;
        this.doNotShow = false;
        this.move = [0, 0];
        this.magnification = [1, 1, 1, 1];
        this.clip = [0, 0, 0, 0];
    }

    async execute(objs) {
        this.parent.image = this;
    }

    async show(ctx) {
        const _image_ = await this.data;
        if (_image_) {
            if (!(this.clip[1] - this.clip[0])) { this.clip[1] = _image_.width  + this.clip[0]; };
            if (!(this.clip[3] - this.clip[2])) { this.clip[3] = _image_.height + this.clip[2]; };
            ctx.drawImage(_image_, 
                this.clip[0], this.clip[2],
                this.clip[1] - this.clip[0],
                this.clip[3] - this.clip[2],
                this.parent.move[0] + this.move[0], 
                this.parent.move[1] + this.move[1], 
                _image_.width, _image_.height
            );
        }
    }
}

//
export class MNGObject extends MNGInstruction {
    constructor(id = "_") {
        super("DEFI", id);
        this.image = new MNGImage(this);
        this.iterator = -1;

        this.canvas = new OffscreenCanvas(2, 2);
        this.ctx = this.canvas.getContext("2d");
        
        this.viewable = true;
        this.doNotShow = false;
        this.move = [0, 0];
        this.magnification = [1, 1, 1, 1];
        this.clip = [0, 0, 0, 0];
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    async show(ctx) {
        /*ctx.beginPath();
        ctx.rect(this.clip[0], this.clip[2], this.clip[1], this.clip[3]);
        ctx.clip();*/

        if (this.viewable) 
        {
            this.image.show(ctx);
            /*ctx.drawImage(this.canvas, 
                this.clip[0],
                this.clip[2],
                this.clip[1]-this.clip[0],
                this.clip[3]-this.clip[2],

                this.offset[0] - (this.magnification[0]-1), 
                this.offset[1] - (this.magnification[1]-1), 
                this.canvas.width  + (this.magnification[1] + this.magnification[0] - 2), 
                this.canvas.height + (this.magnification[3] + this.magnification[2] - 2), 
            );*/

            //for (const _obj_ of this.images) {
                /*const _image_ = await _obj_.data;
                if (_image_) {
                    if (!(_obj_.clip[1] - _obj_.clip[0])) { _obj_.clip[1] = _image_.width  + this.clip[0]; };
                    if (!(_obj_.clip[3] - _obj_.clip[2])) { _obj_.clip[3] = _image_.height + this.clip[2]; };
                    ctx.drawImage(_image_, 
                        _obj_.clip[0], _obj_.clip[2],
                        _obj_.clip[1] - _obj_.clip[0], 
                        _obj_.clip[3] - _obj_.clip[2],
                        this.move[0] + _obj_.move[0], 
                        this.move[1] + _obj_.move[1], 
                        _image_.width, _image_.height
                    );
                }*/

                //_obj_.show(ctx);
            //}
        }
        
    }

    async execute(objs) {
        //let _obj_ = new MNGObject();
        objs.objects[this.id] = this;
        if (objs.visible.indexOf(this.id) < 0 && this.viewable) { objs.visible.push(this.id); };
        return this;
    }
}

//
export class MNGClone extends MNGObject {
    constructor(to = "_", from = "_") {
        super("CLON", to);
        this.from = from;
    }

    async execute(objs) {
        return this;
    }
}

//
export class MNGClip extends MNGInstruction {
    constructor(id = "_") {
        super("CLIP", id);
    }

    async execute(objs) {
        return this;
    }
}

//
export class MNGMove extends MNGInstruction {
    constructor(id = "_") {
        super("MOVE", id);
        this.move = [0, 0];
    }

    async execute(objs) {
        const _obj_ = objs.objects[this.id];
        if (this.mode) {
            _obj_.image.move[0] += this.move[0];
            _obj_.image.move[1] += this.move[1];
        } else {
            _obj_.image.move[0] = this.move[0];
            _obj_.image.move[1] = this.move[1];
        }
        return this;
    }
}

//
export class MNGFrame extends MNGInstruction {
    constructor() {
        super("FRAM", "_");
        //this.clip = [0,0,0,0];
        this.timeout = 65536;
    }

    async execute(objs) {
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

    async execute(objs) {
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
export class OpenMNG extends MNGObject {
    constructor() {
        //this.canvas = new OffscreenCanvas(2, 2);
        super();

        this.images = [];
        this.program = new MNGLoop();
        this.parsed = this.program;
        this.defined = {};

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
        let _show_ = new MNGShow();
        let _clip_ = new MNGClip();
        let _move_ = new MNGMove();
        let _object_ = this;
        let _image_ = null;

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
                    _object_ = new MNGObject(C.view.byteLength >= 2 ? C.view.getUint16(0, false) : 0);
                    if (C.view.byteLength >= 4) {
                        _object_.doNotShow = C.view.getUint8(2, false);
                        _object_.concrete = C.view.getUint8(3, false);
                    }
                    if (C.view.byteLength >= 12) {
                        _object_.move = [C.view.getInt32(4, false), C.view.getInt32(8, false)];
                    } else {
                        _object_.move = [0, 0];
                    }
                    if (C.view.byteLength >= 28) {
                        _object_.clip = [C.view.getUint32(12, false), C.view.getUint32(16, false), C.view.getUint32(20, false), C.view.getUint32(24, false)];
                    } else {
                        _object_.clip = [0, 0, 0, 0];
                    }
                    this.defined[_object_.id] = _object_;
                    this.parsed.instructions.push(_object_);
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
                    if (this.defined[_show_.id]) this.parsed.instructions.push(_show_);
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
                    _move_.move = [C.view.getInt32(5, false), C.view.getInt32(9, false)];

                    //
                    //if (this.defined[_move_.id]) {
                        this.parsed.instructions.push(_move_);
                    //} else
                    /*{
                        if (_move_.mode) {
                            _defi_.initial.move[0] += _move_.move[0], _defi_.initial.move[1] += _move_.move[1];
                        } else {
                            _defi_.initial.move[0] = _move_.move[0], _defi_.initial.move[1] = _move_.move[1];
                        }
                    }*/
                    
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
                    _image_ = createImageBitmap(await this.jngLoader.loadInternal(new DataReader(this.reader.data, C.slice.byteOffset)));
                    _object_.image.data = _image_;
                    //_defi_.images.push({clip: Array.from(_defi_.initial.clip), move: Array.from(_defi_.initial.move), data: _image_});
                    //_object_ = new MNGImage(_object_);
                    this.parsed.instructions.push(_image_);
                break;

                // PNG!
                case "IHDR":
                    _skipping_ = true;
                    _image_ = createImageBitmap(await this.pngLoader.loadInternal(new DataReader(this.reader.data, C.slice.byteOffset)));
                    _object_.image.data = _image_;
                    //_defi_.images.push({clip: Array.from(_defi_.initial.clip), move: Array.from(_defi_.initial.move), data: _image_});
                    //_object_ = new MNGImage(_object_);
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





// state machine
export class MNGRenderer {
    constructor(mng) {
        this.objects = {
            "_": (this.mng = mng)
        };
        this.visible = [];
        this.current = this.mng.program;
        
        //
        this.lastTime = performance.now();
        this.frameTime = 0;
        this.timeout = 65536;

        //
        //var header = this.mng.reader.chunks.find((chunk)=>{ return chunk.name === "MHDR"; });
        this.objects["_"].canvas.width = this.mng.width;
        this.objects["_"].canvas.height = this.mng.height;
        this.objects["_"].doNotShow = false;

        //
        //(this.instruction = this.current.instructions[this.current.iterator++])?.execute(this);
    }

    async toNextInstruction() {
        
        if (this.current.iterator >= this.current.instructions.length) {
            this.current.iterator = this.current.seek;
            while ((++this.current.literator) >= (this.current.lcount) && this.current.lcount >= 0) {
                this.current.literator = 0;
                this.current = this.current.parent;
            }
        }
        await (this.instruction = this.current.instructions[this.current.iterator++])?.execute(this);

        return this;
    }

    //
    async drawObjects() {
        let _isNotShow_ = (this.current?.peek && this.current.peek?.type != "SHOW");
        do {
            if ((performance.now() - this.lastTime) < this.frameTime) { break; };
            await this.toNextInstruction();
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
            //await this.objects["_"].initial(false);

            //
            for (let V of this.visible) {
                if (V == "_") continue; // skip main frame
                await this.objects[V].show(this.objects["_"].ctx);
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

