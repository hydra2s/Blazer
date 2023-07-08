import { swap32 } from "./utils.js";

//
export class BlazerRGBA {
    constructor(imageData) {
        this.toFree = [];
    }

    init() {
        this.getPixelPack = ()=>{ return 0; };
        return this;
    }

    alloc() {
        this.file = new Uint32Array(this.w*this.h + 3);
    }

    shared(buffer, w, h) {
        this.buffer = buffer, this.w = w, this.h = h;
        this.getPixelPack = (x,y,w,h,P)=>{ new Uint32Array(this.file.buffer, P, w).set(new Uint32Array(buffer, y*w*4, w)); return P; };
        this.alloc();
        return this;
    }

    context(ctx, w, h) {
        this.ctx = ctx, this.w = w, this.h = h;
        this.getPixelPack = (x,y,w,h,P)=>{ new Uint32Array(this.file.buffer, P, w*h).set(new Uint32Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return P; };
        this.alloc();
        return this;
    }

    async encode() {
        this.file[0] = 0x41424752;
        this.file[1] = swap32(this.w);
        this.file[2] = swap32(this.h);
        for (let Y=0;Y<this.h;Y++) {
            this.getPixelPack(0,Y,this.w,1,3+this.w*Y);
        }
        return new Blob(this.file, {type: "image/x-rgba"});
    }

    // for real-time animations support
    async loadImageBitmap(url) {
        let response = await fetch(url instanceof Blob ? URL.createObjectURL(url) : url);
        let file = new Uint32Array(await response.arrayBuffer());
        this.w = swap32(file[1]), this.h = swap32(file[2]);
        let imageData = new OffscreenCanvas(this.w, this.h).getContextDeepSpace("2d", { 
            desynchronized: true, 
            willReadFrequently: true
        }).createImageData(this.w, this.h);
        new Uint32Array(imageData.data.buffer).set(new Uint32Array(file.buffer, 12, file.length-3));
        return await createImageBitmap(imageData, {
            colorSpaceConversion: "none",
            resizeQuality: "pixelated"
        });
    }
}
