import { swap32 } from "./utils.js";
import { _module, _temp } from "./module.js";

//
export class BlazerBMP {
    constructor(imageData) {
        this.toFree = [];
    }

    async init() {
        this._module = await _module;
        this._header = new Uint32Array([
            0x0000424d, // (-2) header byte with offset
            0x00000000, // (2) total length
            0x00000000, // (6) skip unused fields
            0x7a000000, // (10) offset to pixels
            0x6c000000, // (14) header size (108)
            0x00000000, // (18) width
            0x00000000, // (22) height
            0x01002000, // (26) 1 plane, 32-bits (RGBA)
            0x03000000, // (30) no compression (BI_ALPHABITFIELDS, 6)
            0x00000000, // (34) bitmap size incl. padding (stride x height)
            0x130B0000, // (38) pixels/meter h (~72 DPI x 39.3701 inch/m)
            0x130B0000, // (42) pixels/meter v
            0x00000000, // (46) skip color
            0x00000000, // (50) important colors
            
            0x0000FF00, // (54) red channel mask
            0x00FF0000, // (58) green channel mask
            0xFF000000, // (62) blue channel mask
            0x000000FF, // (66) alpha channel mask
            //0x00FF0000, // (54) red channel mask
            //0x0000FF00, // (58) green channel mask
            //0x000000FF, // (62) blue channel mask
            //0xFF000000, // (66) alpha channel mask

            0x206e6957  // (70) " win" color space
        ]).map(swap32);
        return this;
    }

    async alloc() {
        let pixelArraySize = (((32 * this.w + 31) / 32) << 2) * this.h;
        let fileAlloc = this._module.alloc((this.fileLength = 122 + pixelArraySize)+2); this.toFree.push(fileAlloc);
        new Uint32Array(this._module.memory.buffer, fileAlloc, 124).set(this._header);

        //
        let _view = new DataView(this._module.memory.buffer, (this._from = fileAlloc+2), 38);
            _view.setUint32(2, this.fileLength, true);
            _view.setUint32(18, this.w, true);
            _view.setUint32(22, -this.h >>> 0, true);
            _view.setUint32(34, pixelArraySize, true);
    }

    shared(imageData) {
        this.buffer = (imageData.data?.buffer || imageData.data), this.w = imageData.width, this.h = imageData.height;
        _temp.getPixelPack = (x,y,w,h,P)=>{ new Uint32Array(this._module.memory.buffer, P, w).set(new Uint32Array(this.buffer, y*w*4, w)); return P; };
        this.alloc();
        return this;
    }

    context(ctx) {
        this.ctx = ctx, this.w = ctx.canvas.width, this.h = ctx.canvas.height;
        _temp.getPixelPack = (x,y,w,h,P)=>{ new Uint8Array(this._module.memory.buffer, P, w*h*4).set(new Uint8Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return P; };
        this.alloc();
        return this;
    }

    // for real-time animations support
    encode() {
        this._module.makeBGRA(this._from + 122, this.w, this.h);
        return new Blob([new Uint8Array(this._module.memory.buffer, this._from, this.fileLength)], {type: "image/bmp"});
    }

    //
    free() {
        // fix memory leak
        this.toFree.map(this._module.free.bind(this._module));
        this.toFree = [];
    }
}
