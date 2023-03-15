import * as _module from "./build/release.js";

class FileWriter {
    constructor(memory, offset, size) {
        this.offset = 0;
        this.view = new DataView(memory, offset, size);
    }

    set16(data) {
        this.view.setUint16(this.offset, data, true);
        this.offset += 2
    }

    set32(data) {
        this.view.setUint32(this.offset, data, true);
        this.offset += 4
    }

    seek(delta) {
        this.offset += delta;
    }
}

export class Blazer {
    constructor(imageData) {
        
    }

    async init() {
        this._module = await import("./build/release.js");
        return this;
    }

    async encode(ctx, w, h) {
        let idata          = ctx.getImageData(0, 0, w, h),
            stride         = ((32 * w + 31) / 32) << 2,
            pixelArraySize = stride * h,
            fileLength     = 122 + pixelArraySize;

        //
        //let _module = this._module;
        let _from = _module.alloc(fileLength);
        let _idat = _from + 122;
        new Uint8Array(_module.memory.buffer, _from + 122, idata.data.length).set(idata.data);
        let writer = new FileWriter(_module.memory.buffer, _from, fileLength);

        // Header
        writer.set16(0x4d42);									// BM
        writer.set32(writer.view.byteLength); 					// total length
        writer.seek(4);											// skip unused fields
        writer.set32(0x7a);										// offset to pixels

        // DIB header
        writer.set32(0x6c);										// header size (108)
        writer.set32(w);
        writer.set32(-h >>> 0);									// negative = top-to-bottom
        writer.set16(1);										// 1 plane
        writer.set16(32);										// 32-bits (RGBA)
        writer.set32(3);										// no compression (BI_BITFIELDS, 3)
        writer.set32(pixelArraySize);							// bitmap size incl. padding (stride x height)
        writer.set32(2835);										// pixels/meter h (~72 DPI x 39.3701 inch/m)
        writer.set32(2835);										// pixels/meter v
        writer.seek(8);											// skip color/important colors
        writer.set32(0xff0000);									// red channel mask
        writer.set32(0xff00);									// green channel mask
        writer.set32(0xff);										// blue channel mask
        writer.set32(0xff000000);								// alpha channel mask
        writer.set32(0x57696e20);								// " win" color space

        //
        await _module.makeBGR(_idat, w, h);

        //
        return new Blob([new Uint8Array(_module.memory.buffer, _from, fileLength)], {type: "image/bmp"});
    }
}
