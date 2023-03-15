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
        let _module = this._module;
        let _from = _module.alloc(fileLength+2)+2;
        let _idat = _from + 122;
        let _id32 = new Uint32Array(idata.data.buffer);
        let _pt32 = new Uint32Array(_module.memory.buffer, _from + 122, idata.data.length>>2); _pt32.set(_id32);
        //new Uint8Array(_module.memory.buffer, _from + 122, idata.data.length).set(idata.data);
        const header = new Uint8Array([ // TODO: encode as UINT32
            0x42, 0x4d,             // (0) BM
            0x00, 0x00, 0x00, 0x00, // (2) total length
            0x00, 0x00, 0x00, 0x00, // (6) skip unused fields
            0x7a, 0x00, 0x00, 0x00, // (10) offset to pixels
            0x6c, 0x00, 0x00, 0x00, // (14) header size (108)
            0x00, 0x00, 0x00, 0x00, // (18) width
            0x00, 0x00, 0x00, 0x00, // (22) height
               1, 0x00,   32, 0x00, // (26) 1 plane, 32-bits (RGBA)
               3, 0x00, 0x00, 0x00, // (30) no compression (BI_BITFIELDS, 3)
            0x00, 0x00, 0x00, 0x00, // (34) bitmap size incl. padding (stride x height)
            0x13, 0xB , 0x00, 0x00, // (38) pixels/meter h (~72 DPI x 39.3701 inch/m)
            0x13, 0xB , 0x00, 0x00, // (42) pixels/meter v
            0x00, 0x00, 0x00, 0x00, // (46) skip color/important colors
            0x00, 0x00, 0x00, 0x00, // (50) skip color/important colors
            0x00, 0x00, 0xFF, 0x00, // (54) red channel mask
            0x00, 0xFF, 0x00, 0x00, // (60) green channel mask
            0xFF, 0x00, 0x00, 0x00, // (64) blue channel mask
            0x00, 0x00, 0x00, 0xFF, // (66) alpha channel mask
            0x20, 0x6e, 0x69, 0x57  // (70) " win" color space
        ]);

        //
        let _view = new DataView(header.buffer);
        _view.setUint32(2, fileLength, true);
        _view.setUint32(18, w, true);
        _view.setUint32(22, -h >>> 0, true);
        _view.setUint32(34, pixelArraySize, true);

        //
        new Uint8Array(_module.memory.buffer, _from, 122).set(header);

        //
        await _module.makeBGR(_idat, w, h);

        //
        return new Blob([new Uint8Array(_module.memory.buffer, _from, fileLength)], {type: "image/bmp"});
    }
}
