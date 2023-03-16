export class BlazerBMP {
    constructor(imageData) {
        
    }

    async init() {
        this.getPixelPack = ()=>{ return 0; };

        //
        async function instantiate(module, imports = {}) {
            const adaptedImports = {
                env: Object.assign(Object.create(globalThis), imports.env || {}, 
                {
                    abort(message, fileName, lineNumber, columnNumber) {
                        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
                        message = __liftString(message >>> 0);
                        fileName = __liftString(fileName >>> 0);
                        lineNumber = lineNumber >>> 0;
                        columnNumber = columnNumber >>> 0;
                        (() => {
                        // @external.js
                        throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
                        })();
                    },
                }),
            };
            const { exports } = await WebAssembly.instantiate(module, adaptedImports);
            const memory = exports.memory || imports.env.memory;
            const adaptedExports = Object.setPrototypeOf({
                alloc(size) {
                    return exports.alloc(size) >>> 0;
                },
            }, exports);
            function __liftString(pointer) {
                if (!pointer) return null;
                const end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1, memoryU16 = new Uint16Array(memory.buffer);
                let start = pointer >>> 1, string = "";
                while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
                return string + String.fromCharCode(...memoryU16.subarray(start, end));
            }
            return adaptedExports;
        }
        const _module = await (async url => instantiate(await (async () => {
                try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
                catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
            })(), {
                env: {
                    getPixelPack: (x,y,w,h,P)=>{ return this.getPixelPack(x,y,w,h,P); }
                }
            }
        ))(new URL("build/release.wasm", import.meta.url));
        this._module = _module;
        
        //
        this._header = new Uint8Array([ // TODO: encode as UINT32
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
            0x00, 0xFF, 0x00, 0x00, // (54) red channel mask
            0x00, 0x00, 0xFF, 0x00, // (60) green channel mask
            0x00, 0x00, 0x00, 0xFF, // (64) blue channel mask
            0xFF, 0x00, 0x00, 0x00, // (66) alpha channel mask
            //0xFF, 0x00, 0x00, 0x00, // (54) red channel mask
            //0x00, 0xFF, 0x00, 0x00, // (60) green channel mask
            //0x00, 0x00, 0xFF, 0x00, // (64) blue channel mask
            //0x00, 0x00, 0x00, 0xFF, // (66) alpha channel mask
            0x20, 0x6e, 0x69, 0x57  // (70) " win" color space
        ]);
        return this;
    }

    context(ctx, w, h) {
        this.ctx = ctx, this.w = w, this.h = h;
        let stride         = ((32 * w + 31) / 32) << 2,
            pixelArraySize = stride * h;

        //
        this.fileLength = 122 + pixelArraySize;
        this._from = this._module.alloc(this.fileLength+2)+2;
        new Uint8Array(this._module.memory.buffer, this._from, 122).set(this._header);

        //
        let _view = new DataView(this._module.memory.buffer, this._from, 122);
        _view.setUint32(2, this.fileLength, true);
        _view.setUint32(18, w, true);
        _view.setUint32(22, -h >>> 0, true);
        _view.setUint32(34, pixelArraySize, true);

        //
        this.getPixelPack = (x,y,w,h,P)=>{ new Uint32Array(this._module.memory.buffer, P, w*h).set(new Uint32Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return P; };

        //
        return this;
    }

    // for real-time animations support
    encode() {
        this._module.makeARGB(this._from + 122, this.w, this.h);
        return new Blob([new Uint8Array(this._module.memory.buffer, this._from, this.fileLength)], {type: "image/bmp"});
    }
}



// 
class PNGChunk {
    constructor(slice,name="IEND",length=0) {
        this.data = null;
        this.view = null;
        this.length = length;
        this.name = name;
        this.slice = slice;
        this.crc32 = 0;
    }

    compile() {
        var view = new DataView(this.slice.buffer, this.slice.byteOffset, this.length+4+4+4);
        view.setUint32(0, this.length, false);
        view.setUint32(4, this.name.charCodeAt(0) | (this.name.charCodeAt(1)<<8) | (this.name.charCodeAt(2)<<16) | (this.name.charCodeAt(3)<<24), true);
        view.setUint32(this.length+4+4, this.crc32 = CRC32.buf(new Uint8Array(this.slice.buffer, this.slice.byteOffset+4, this.length+4)), false);
        return this;
    }
}

// NOT FASTEST YET!
export class BlazerPNG {
    constructor() {
        
    }

    async init() {
        this.getPixelPack = ()=>{ return 0; };

        //
        async function instantiate(module, imports = {}) {
            const adaptedImports = {
                env: Object.assign(Object.create(globalThis), imports.env || {}, 
                {
                    abort(message, fileName, lineNumber, columnNumber) {
                        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
                        message = __liftString(message >>> 0);
                        fileName = __liftString(fileName >>> 0);
                        lineNumber = lineNumber >>> 0;
                        columnNumber = columnNumber >>> 0;
                        (() => {
                        // @external.js
                        throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
                        })();
                    },
                }),
            };
            const { exports } = await WebAssembly.instantiate(module, adaptedImports);
            const memory = exports.memory || imports.env.memory;
            const adaptedExports = Object.setPrototypeOf({
                alloc(size) {
                    return exports.alloc(size) >>> 0;
                },
            }, exports);
            function __liftString(pointer) {
                if (!pointer) return null;
                const end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1, memoryU16 = new Uint16Array(memory.buffer);
                let start = pointer >>> 1, string = "";
                while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
                return string + String.fromCharCode(...memoryU16.subarray(start, end));
            }
            return adaptedExports;
        }
        const _module = await (async url => instantiate(await (async () => {
                try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
                catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
            })(), {
                env: {
                    getPixelPack: (x,y,w,h,P)=>{ return this.getPixelPack(x,y,w,h,P); }
                }
            }
        ))(new URL("build/release.wasm", import.meta.url));
        this._module = _module;
        
        //
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);

        //
        return this;
    }

    concat(resultConstructor, ...arrays) {
        let totalLength = 0;
        for (let arr of arrays) {
            totalLength += arr.length;
        }
        let result = new resultConstructor(totalLength);
        let offset = 0;
        for (let arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    encodeIDAT() {
        var IDAT = new PNGChunk();
        var SIZE = 2 + this.h * (6 + this.w*4) + 4;
        var data = this._module.alloc(SIZE+4+4+4);
        IDAT.length = SIZE;
        IDAT.name = "IDAT";
        IDAT.data = new Uint8Array(this._module.memory.buffer, data+8, SIZE);
        IDAT.view = new DataView(this._module.memory.buffer, data+8, SIZE);
        IDAT.view.setUint16(0, 0x7801, false);

        //
        this._module.makePNGData(data+8+2,this.w,this.h);

        //
        IDAT.slice = new Uint8Array(this._module.memory.buffer, data, SIZE+4+4+4);
        this.chunks.push(IDAT.compile());
        return this;
    }

    encodeIHDR() {
        var IHDR = new PNGChunk();
        var data = this._module.alloc(13+4+4+4);
        IHDR.length = 13;
        IHDR.name = "IHDR";
        IHDR.data = new Uint8Array(this._module.memory.buffer, data+8, 13);
        IHDR.view = new DataView(this._module.memory.buffer, data+8, 13);
        IHDR.view.setUint32(0, this.w, false);
        IHDR.view.setUint32(4, this.h, false);
        IHDR.view.setUint32(8, 0x08060000, false);
        IHDR.view.setUint8(12, 0, false);
        IHDR.slice = new Uint8Array(this._module.memory.buffer, data, 13+4+4+4);
        this.chunks.splice(0, 0, IHDR.compile());
        return this;
    }

    encodeIEND() {
        var IEND = new PNGChunk();
        var data = this._module.alloc(0+4+4+4);
        IEND.length = 0;
        IEND.slice = new Uint8Array(this._module.memory.buffer, data, 0+4+4+4);
        IEND.name = "IEND";
        this.chunks.push(IEND.compile());
        return this;
    }

    encode(chunks) {
        this.chunks = [...(chunks||[])].filter((C)=>{ return C.name != "IHDR" && C.name != "IDAT" && C.name != "IEND"; });
        
        // TODO: store IDAT for recoding
        this.encodeIHDR();
        this.encodeIDAT();
        this.encodeIEND();
        
        //
        chunks = this.chunks; this.chunks = [];

        //
        //chunks = this.chunks; this.chunks = [];
        return new Blob([this.PNGsignature, ...chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});
    }

    context(ctx, w, h) {
        this.ctx = ctx, this.w = w, this.h = h;

        //
        this.getPixelPack = (x,y,w,h,P)=>{ new Uint8Array(this._module.memory.buffer, P, w*h*4).set(new Uint8Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return P; };

        //
        return this;
    }
}



// UNUSED!
export class Compositor {
    constructor() {
        
    }

    async init() {
        const adapter = await navigator.gpu.requestAdapter();
        const device = await adapter.requestDevice();
        const presentationFormat = navigator.gpu.getPreferredCanvasFormat ? navigator.gpu.getPreferredCanvasFormat() : 'rgba8unorm';

        //
        this.device = device;
        this.adapter = adapter;
        this.presentationFormat = presentationFormat;

        //
        const bindGroupLayout = device.createBindGroupLayout({
            entries: [
                {binding: 0, visibility: 0x2, sampler: { type: "filtering" } },
                {binding: 1, visibility: 0x2, texture: { access: "read-only", format: "rgba8unorm", viewDimension: "2d" } },
                {binding: 2, visibility: 0x2, texture: { access: "read-only", format: "rgba8unorm", viewDimension: "2d" } }
            ]
        });
        
        //
        const clearGroupLayout = device.createBindGroupLayout({
            entries: [
            ]
        });

        //
        this.posBufData = new Float32Array([
            -1.0,  1.0,
             1.0,  1.0,
            -1.0, -1.0,

            -1.0, -1.0,
             1.0,  1.0,
             1.0, -1.0,
        ]);
        this.posBuf = device.createBuffer({
            size: this.posBufData.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(
          this.posBuf,
          0,
          this.posBufData.buffer,
          this.posBufData.byteOffset,
          this.posBufData.byteLength
        );
        
        //
        this.texBufData = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,

            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ]);
        this.texBuf = device.createBuffer({
            size: this.texBufData.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(
          this.texBuf,
          0,
          this.texBufData.buffer,
          this.texBufData.byteOffset,
          this.texBufData.byteLength
        );

        //
        this.clearpip = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [clearGroupLayout]
            }),
            vertex: {
                buffers: [{
                    arrayStride: 4*2,
                    attributes: [{ // position
                          shaderLocation: 0,
                          offset: 0,
                          format: 'float32x2',
                    }],
                }],
                module: device.createShaderModule({ code: `
                struct VertexOutput {
                    @builtin(position) Position : vec4<f32>,
                }
                
                @vertex
                fn main(
                    @location(0) position : vec2<f32>,
                    @builtin(vertex_index) vIndex: u32,
                ) -> VertexOutput {
                    var output : VertexOutput;
                    output.Position = vec4<f32>(position, 0.0, 1.0);
                    return output;
                }
                ` }),
                entryPoint: 'main',
            },
            fragment: {
                module: device.createShaderModule({ code: `
                @fragment
                fn main() -> @location(0) vec4<f32> {
                    return vec4<f32>(0.0f, 0.0f, 0.0f, 0.0f);
                }
` }),
                entryPoint: 'main',
                targets: [{ format: presentationFormat, blend: {
                    color: {
                        operation: "add",
                        srcFactor: "zero",
                        dstFactor: "zero"
                    },
                    alpha: {
                        operation: "add",
                        srcFactor: "zero",
                        dstFactor: "zero"
                    }
                } }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });

        //
        this.pipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout]
            }),
            vertex: {
                buffers: [{
                    arrayStride: 4*2,
                    attributes: [{ // position
                          shaderLocation: 0,
                          offset: 0,
                          format: 'float32x2',
                    }],
                }, {
                    arrayStride: 4*2,
                    attributes: [{ // UV
                          shaderLocation: 1,
                          offset: 0,
                          format: 'float32x2',
                    }],
                }],
                module: device.createShaderModule({ code: `
                struct VertexOutput {
                    @builtin(position) Position : vec4<f32>,
                    @location(0) fragUV : vec2<f32>,
                }
                
                @vertex
                fn main(
                    @location(0) position : vec2<f32>,
                    @location(1) uv : vec2<f32>,
                    @builtin(vertex_index) vIndex: u32,
                ) -> VertexOutput {
                    var output : VertexOutput;
                    output.Position = vec4<f32>(position, 0.0, 1.0); 
                    output.fragUV = uv;
                    return output;
                }
                ` }),
                entryPoint: 'main',
            },
            fragment: {
                module: device.createShaderModule({ code: `
                @group(0) @binding(0) var eSampler: sampler;
                @group(0) @binding(1) var RGBtex: texture_2d<f32>;
                @group(0) @binding(2) var Atex: texture_2d<f32>;
                
                @fragment
                fn main(
                    @location(0) fragUV: vec2<f32>
                ) -> @location(0) vec4<f32> {
                    return vec4<f32>(textureSample(RGBtex, eSampler, fragUV).xyz, textureSample(Atex, eSampler, fragUV).x);
                }
` }),
                entryPoint: 'main',
                targets: [{ format: presentationFormat, blend: {
                    color: {
                        operation: "add",
                        srcFactor: "one",
                        dstFactor: "one"
                    },
                    alpha: {
                        operation: "add",
                        srcFactor: "one",
                        dstFactor: "one"
                    }
                } }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });

        return this;
    }

    // composite for PNG encoding
    async composite(W, H, RGBp, Ap) {
        this.W = W, this.H = H;

        //
        const device = this.device;
        const canvas = new OffscreenCanvas(W, H);
        const context = canvas.getContext('webgpu', {
            premultipliedAlpha: true,
            preserveDrawingBuffer: true
        });
        context.configure({
            device,
            format: this.presentationFormat,
            alphaMode: 'premultiplied',
        });

        //
        const RGB = await createImageBitmap(await RGBp);
        const A = await createImageBitmap(await Ap);
        
        //
        const RGBtex = device.createTexture({
            size: [RGB.width, RGB.height, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        });
        const Atex = device.createTexture({
            size: [A.width, A.height, 1],
            format: 'r8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        });

        //
        device.queue.copyExternalImageToTexture({ source: RGB }, { texture: RGBtex }, [RGB.width, RGB.height]);
        device.queue.copyExternalImageToTexture({ source: A }, { texture: Atex }, [A.width, A.height]);
        
        //
        const uniformBufferSize = 8;
        const uniformBuffer = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        //
        const sampler = device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
        });

        //
        const uniformBindGroup = device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: sampler,
                    visibility: 0x3
                },
                {
                    binding: 1,
                    resource: RGBtex.createView(),
                    visibility: 0x3
                },
                {
                    binding: 2,
                    resource: Atex.createView(),
                    visibility: 0x3
                },
            ],
        });
        
        //
        const clearBindGroup = device.createBindGroup({
            layout: this.clearpip.getBindGroupLayout(0),
            entries: [],
        });
        
        //
        var SIZE = new Uint32Array([this.W, this.H]);
        device.queue.writeBuffer(
            uniformBuffer, 0,
            SIZE.buffer,
            SIZE.byteOffset,
            SIZE.byteLength
        );

        //
        const textureView = context.getCurrentTexture().createView();
        const commandEncoder = device.createCommandEncoder();
        const renderPassDescriptor = { colorAttachments: [
            {
                view: textureView,
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
                loadOp: 'load',
                storeOp: 'store',
                loadValue: 'load',
            },
        ]};
        const clearPassDescriptor = { colorAttachments: [
            {
                view: textureView,
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
                loadOp: 'load',
                storeOp: 'store',
                loadValue: 'load',
            },
        ]};

        //
        const clearEncoder = commandEncoder.beginRenderPass(clearPassDescriptor);
        clearEncoder.setVertexBuffer(0, this.posBuf);
        clearEncoder.setPipeline(this.clearpip);
        clearEncoder.setBindGroup(0, clearBindGroup);
        clearEncoder.draw(6, 1, 0, 0);
        if (clearEncoder.end) { clearEncoder.end(); }

        //
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setVertexBuffer(0, this.posBuf);
        passEncoder.setVertexBuffer(1, this.texBuf);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, uniformBindGroup);
        passEncoder.draw(6, 1, 0, 0);
        if (passEncoder.end) { passEncoder.end(); }
        
        //
        device.queue.submit([commandEncoder.finish()]);
        
        //
        if (device.queue.onSubmittedWorkDone) { await device.queue.onSubmittedWorkDone(); } //else { await new Promise(requestAnimationFrame); }

        // encode as raw PNG image
        /*const blob = await (canvas.convertToBlob || canvas.toBlob).call(canvas, {type: "image/png"});
        const FR = new FileReader();
        FR.readAsArrayBuffer(blob);
        const READ = new Promise(resolve => {
            FR.onload = ()=>resolve(FR.result);
        });
        return await READ;*/

        return canvas;//canvas.transferToImageBitmap();
    }
}




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




class DataReader {
    constructor(data) {
        this.data = data;
        this.offset = 0;
        this.chunks = [];
        this.signature = null;
        this.chunk = null;
    }
    
    readSignature() {
        this.signature = new Uint8Array(this.data, this.offset, 8);
        this.offset += 8;
        this.chunk = new PNGChunk();
    }

    readLength() {
        this.chunk.length = new DataView(this.data, this.offset, 4).getUint32(0, false);
        this.offset += 4;
    }

    readName() {
        this.chunk.name = new TextDecoder().decode(new Uint8Array(this.data, this.offset, 4));
        this.offset += 4;
    }

    readCRC() {
        this.chunk.crc32 = new DataView(this.data, this.offset, 4).getUint32(0, false);
        this.offset += 4;
    }

    readData() {
        this.chunk.data = new Uint8Array(this.data, this.offset, this.chunk.length);
        this.chunk.view = new DataView(this.data, this.offset, this.chunk.length);
        this.offset += this.chunk.length;
    }

    makeSlice() {
        this.chunks.push(this.chunk);
        this.chunk.slice = new Uint8Array(this.data, this.offset-this.chunk.length-4-4-4, this.chunk.length+4+4+4);
        this.chunk = new PNGChunk();
    }
}

//
let loadImage = async (url) => {
    let image = new Image();
    image.decoding = "async";
    image.fetchPriority = "high";
    image.loading = "eager";
    image.src = await url;
    await image.decode();

    // FOR DEBUG!
    /*
    image.width = 160;
    image.height = 120;
    image.alt = "Problematic";
    document.body.appendChild(image);
    */

    //
    return image;
}

//
let saveBlob = (url, name) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href =  url;
    a.download = name;
    a.click();
    a.remove();
    return url;
}

//
let concat = (resultConstructor, ...arrays) => {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

//
let encodeURL = async (chunked, type, blob = false) => {
    chunked = chunked.map((chunk)=>{
        if (typeof chunk === "string") {
            return new TextEncoder().encode(chunk);
        }
        return chunk;
    });

    const BLOB = new Blob(chunked, {type});
    if (blob) { return URL.createObjectURL(BLOB); };
    {
        const FR = new FileReader();
        FR.readAsDataURL(BLOB);
        const READ = new Promise(resolve => {
            FR.onload = ()=>resolve(FR.result);
        });
        return await READ;
    }

    //return `data:${type};base64,${btoa(String.fromCharCode(...concat(Uint8Array, ...chunked)))}`;
}

//
let toBlob = (canvas, mimeType, quality) => {
    return new Promise((resolve, reject)=>{
        canvas.toBlob(resolve, mimeType, quality);
    });
}

// for JNG alpha channel
class ReconstructPNG {
    constructor(chunks, header) {
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
        this.chunks = chunks.filter((chunk)=>{
            //chunk.name != "JHDR" && 
            //chunk.name != "JDAT" && 
            //chunk.name != "JDAA" && 
            //chunk.name != "JEND"
            return chunk.name == "IDAT";
        });
        this.header = header;
    }

    encodeIHDR() {
        var IHDR = new PNGChunk();
        var data = new ArrayBuffer(13+4+4+4);
        IHDR.length = 13;
        IHDR.name = "IHDR";
        IHDR.data = new Uint8Array(data, 8, 13);
        IHDR.view = new DataView(data, 8, 13);
        IHDR.view.setUint32(0, this.header.width, false);
        IHDR.view.setUint32(4, this.header.height, false);
        IHDR.view.setUint8(8, this.header.bitDepth, false);
        IHDR.view.setUint8(9, 0, false);
        IHDR.view.setUint8(10, 0, false);
        IHDR.view.setUint8(11, this.filter, false);
        IHDR.view.setUint8(12, this.interlace, false);
        IHDR.slice = new Uint8Array(data);
        this.chunks.splice(0, 0, IHDR.compile());
        return this;
    }

    encodeIEND() {
        var IEND = new PNGChunk();
        var data = new ArrayBuffer(0+4+4+4);
        IEND.length = 0;
        IEND.slice = new Uint8Array(data);
        IEND.name = "IEND";
        this.chunks.push(IEND.compile());
        return this;
    }

    encode() {
        this.encodeIHDR();
        this.encodeIEND();
        return (encodeURL([/*[this.concat(Uint8Array, JPEGc)]*/this.PNGsignature, ...this.chunks.map((chunk)=>{
            return chunk.slice;
        })], "image/png"));
    }
}

//
export class OpenJNG {
    constructor() {
        this.JNGSignature = new Uint8Array([ 0x8b, 0x4a, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a ]);
        this.header = {
            width: 0,
            height: 0, 
            bitDepth: 8,
        }
        this.alphaHeader = {
            width: 0,
            height: 0, 
            bitDepth: 8,
            filter: 0,
            compression: 0,
            interlace: 0
        }
        this.A = null;
        this.RGB = null;
    }

    compare(a, b) {
        for (let i = a.length; -1 < i; i -= 1) {
          if ((a[i] !== b[i])) return false;
        }
        return true;
    }

    equal32(a, b) {
        const ua = new Uint32Array(a.buffer, a.byteOffset, a.byteLength / 4);
        const ub = new Uint32Array(b.buffer, b.byteOffset, b.byteLength / 4);
        return this.compare(ua, ub);
    }
    
    checkSignature() {
        return this.equal32(this.reader.signature, this.JNGSignature);
    }
    
    concat(resultConstructor, ...arrays) {
        let totalLength = 0;
        for (let arr of arrays) {
            totalLength += arr.length;
        }
        let result = new resultConstructor(totalLength);
        let offset = 0;
        for (let arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
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

        //
        if (this.checkSignature()) {
            this.RGB = this.concatJDAT();
            {
                if (this.alphaHeader.compression == 8 && this.alphaHeader.bitDepth > 0 || this.reader.chunks.find((chunk)=>{return chunk.name == "JDAA" || chunk.name == "JdAA";})) { this.A = this.concatJDAA(); } else
                if (this.alphaHeader.compression == 0 && this.alphaHeader.bitDepth > 0 || this.reader.chunks.find((chunk)=>{return chunk.name == "IDAT";})) { this.A = this.reconstructPNG(); };
            }
        }
        
        //
        return this;
    }
    
    readHeader() {
        var header = this.reader.chunks.find((chunk)=>{ return chunk.name === "JHDR"; });
        this.alphaHeader.width = this.header.width = header.view.getUint32(0, false);
        this.alphaHeader.height = this.header.height = header.view.getUint32(4, false);
        this.alphaHeader.bitDepth = header.view.getUint8(12, false);
        this.alphaHeader.compression = header.view.getUint8(13, false);
        this.alphaHeader.filter = header.view.getUint8(14, false);
        this.alphaHeader.interlace = header.view.getUint8(15, false);
    }
    
    async load(URL) {
        let response = await fetch(URL);
        if (response.ok) {
            this.reader = new DataReader(await response.arrayBuffer());
            this.readImage();
        } else {
            console.error("Error HTTP: " + response.status);
        }
        return this;
    }

    async reconstructPNG() {
        return new ReconstructPNG(this.reader.chunks, this.alphaHeader).encode();
    }

    async concatJDAT() {
        var JDATs = this.reader.chunks.filter((chunk)=>{return chunk.name == "JDAT";});
        var JPEGc = JDATs.map((chunk)=>{ return chunk.data; });
        return (encodeURL(/*[this.concat(Uint8Array, JPEGc)]*/JPEGc, "image/jpeg"));
    }

    async concatJDAA() {
        var JDATs = this.reader.chunks.filter((chunk)=>{return chunk.name == "JDAA" || chunk.name == "JdAA";});
        var JPEGc = JDATs.map((chunk)=>{ return chunk.data; });
        return (encodeURL(/*[this.concat(Uint8Array, JPEGc)]*/JPEGc, "image/jpeg"));
    }

    async recodePNG() {
        if (this.checkSignature()) {
            // kill almost instantly
            let IMAGE = createImageBitmap(await loadImage(this.A ? encodeURL([`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <svg color-interpolation="auto" width="${this.header.width}" height="${this.header.height}" viewBox="0 0 ${this.header.width} ${this.header.height}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
                <defs><mask id="mask"><image xlink:href="${await this.A}" width="${this.header.width}" height="${this.header.height}"/></mask></defs>
                <image xlink:href="${await this.RGB}" width="${this.header.width}" height="${this.header.height}" mask="url(#mask)"/>
                </svg>
                `], `image/svg+xml;charset=utf-8`, true) : this.RGB));
            
            //
            if (!this.blazer) {
                this.blazer = new BlazerPNG();
                await this.blazer.init();
            }
            
            {
                let canvas = new OffscreenCanvas(this.header.width, this.header.height);
                var ctx = canvas.getContext("2d", { willReadFrequently: true });
                    ctx.clearRect(0, 0, this.header.width, this.header.height);
                    ctx.drawImage(await IMAGE, 0, 0);
                
                //
                this.blazer.context(ctx, canvas.width, canvas.height);
                //console.time("BlazePNG");
                let blob = this.blazer.encode(this.reader.chunks.filter((C)=>C.name!="JHDR"&&C.name!="JDAA"&&C.name!="JDAT"&&C.name!="JdAA"&&C.name!="IDAT"));
                //console.timeEnd("BlazePNG");
                
                return loadImage(URL.createObjectURL(blob));
            }
            
            //
            
            /*console.time("NativePNG");
            const blob = await (canvas.convertToBlob || canvas.toBlob).call(canvas, {type: "image/png", quality: 0});
            console.timeEnd("NativePNG");
            const FR = new FileReader();
            FR.readAsArrayBuffer(blob);
            const READ = new Promise(resolve => {
                FR.onload = ()=>resolve(FR.result);
            });
            return await new InjectPNG(this.reader.chunks, this.header).recode(await READ);*/
        }
        return null;
    }

}
