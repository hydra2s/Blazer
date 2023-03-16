
class PNGChunk {
    constructor() {
        this.data = null;
        this.view = null;
        this.length = 0;
        this.crc32 = 0;
        this.name = "";
        this.slice = null;
    }

    compile() {
        var view = new DataView(this.slice.buffer, this.slice.byteOffset, this.length+4+4+4);
        view.setUint32(0, /*view.byteLength-4-4-4*/this.length, false);
        view.setUint8(4, this.name.charCodeAt(0));
        view.setUint8(5, this.name.charCodeAt(1));
        view.setUint8(6, this.name.charCodeAt(2));
        view.setUint8(7, this.name.charCodeAt(3));
        view.setUint32(this.length+4+4, this.crc32 = CRC32.buf(new Uint8Array(this.slice.buffer, this.slice.byteOffset+4, this.length+4)), false);
        return this;
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
    let promise = new Promise((resolve, reject) => {
        image.onload = ()=>{ resolve(image); };
        image.onerror = (e) => { reject(e); };
    });
    image.src = await url;

    // FOR DEBUG!
    /*
    image.width = 160;
    image.height = 120;
    image.alt = "Problematic";
    document.body.appendChild(image);
    */

    //
    return promise;
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

//
class IDATLine {
    constructor(buffer, offset, stride, last, pack) {
        this.view = new DataView(buffer, offset, (this.stride = stride)+6);
        this.view.setUint8(0, last, false);
        this.view.setUint16(1, (stride+1), true); this.view.setUint16(3, ~(stride+1), true);
        this.view.setUint8(5, 0, false);
        new Uint8Array(buffer, offset+6, stride).set(pack);
        this.data = new Uint8Array(buffer, offset+5, stride+1);
    }
}



//
class BlazerPNG {
    constructor() {
        
    }

    async init(chunks) {
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
                    getPixelPack: (x,y,w,h)=>{ return this.getPixelPack(x,y,w,h); }
                }
            }
        ))(new URL("build/release.wasm", import.meta.url));
        this._module = _module;
        
        //
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
        this.chunks = (this.ext = [...(chunks||[])]).filter((chunk)=>{
            chunk.name != "IHDR" && 
            chunk.name != "IDAT" && 
            chunk.name != "IEND";
        });

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
        var data = new ArrayBuffer(SIZE+4+4+4);
        IDAT.length = SIZE;
        IDAT.name = "IDAT";
        IDAT.data = new Uint8Array(data, 8, SIZE);
        IDAT.view = new DataView(data, 8, SIZE);
        IDAT.view.setUint8(0, 0x78, false);
        IDAT.view.setUint8(1, 1, false);
        let lines = [];
        for (let Y=0;Y<this.h;Y++) {
            lines.push(new IDATLine(IDAT.data.buffer, 8+2+(this.w*4+6)*Y, this.w*4, Y==this.h-1, this.ctx.getImageData(0,Y,this.w,1).data));
        }
        IDAT.view.setUint32(SIZE-4, ADLER32.buf(this.concat(Uint8Array, ...lines.map((L)=>L.data))), false);
        IDAT.slice = new Uint8Array(data);
        this.chunks.push(IDAT.compile());
        return this;
    }

    encodeIHDR() {
        var IHDR = new PNGChunk();
        var data = new ArrayBuffer(13+4+4+4);
        IHDR.length = 13;
        IHDR.name = "IHDR";
        IHDR.data = new Uint8Array(data, 8, 13);
        IHDR.view = new DataView(data, 8, 13);
        IHDR.view.setUint32(0, this.w, false);
        IHDR.view.setUint32(4, this.h, false);
        IHDR.view.setUint8(8, 8, false);
        IHDR.view.setUint8(9, 6, false);
        IHDR.view.setUint8(10, 0, false);
        IHDR.view.setUint8(11, 0, false);
        IHDR.view.setUint8(12, 0, false);
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
        this.encodeIDAT();
        this.encodeIEND();

        //
        return new Blob([this.PNGsignature, ...this.chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});
    }

    context(ctx, w, h) {
        this.ctx = ctx, this.w = w, this.h = h;

        //
        this.getPixelPack = (x,y,w,h)=>{ new Uint32Array(this._module.memory.buffer, this._payload, w*h).set(new Uint32Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return this._payload; };

        //
        return this;
    }
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
        return loadImage(encodeURL([/*[this.concat(Uint8Array, JPEGc)]*/this.PNGsignature, ...this.chunks.map((chunk)=>{
            return chunk.slice;
        })], "image/png"));
    }
}

class Compositor {
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

class OpenJNG {
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
        return loadImage(encodeURL(/*[this.concat(Uint8Array, JPEGc)]*/JPEGc, "image/jpeg"));
    }

    async concatJDAA() {
        var JDATs = this.reader.chunks.filter((chunk)=>{return chunk.name == "JDAA" || chunk.name == "JdAA";});
        var JPEGc = JDATs.map((chunk)=>{ return chunk.data; });
        return loadImage(encodeURL(/*[this.concat(Uint8Array, JPEGc)]*/JPEGc, "image/jpeg"));
    }

    async recodePNG() {
        if (this.checkSignature()) {
            let canvas = null;
            let IMAGE = null;
            if (this.A) {
                //if (!this.compositor) {
                    //this.compositor = new Compositor().init();
                //}
                //canvas = await (await this.compositor).composite(this.header.width, this.header.height, await this.RGB, await this.A);
                
                let RGB = await this.RGB;
                let A = await this.A;
                await new Promise(requestAnimationFrame);

                // kill almost instantly
                IMAGE = loadImage(encodeURL([`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <svg color-interpolation="auto" width="${this.header.width}" height="${this.header.height}" viewBox="0 0 ${this.header.width} ${this.header.height}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
                <defs><mask id="mask"><image xlink:href="${A.src}" width="${this.header.width}" height="${this.header.height}"/></mask></defs>
                <image xlink:href="${RGB.src}" width="${this.header.width}" height="${this.header.height}" mask="url(#mask)"/>
                </svg>
                `], `image/svg+xml`, true));
            } else {
                IMAGE = this.RGB;
            } //else 
            
            //
            if (!this.blazer) {
                this.blazer = new BlazerPNG();
                await this.blazer.init();
            }
            
            {
                canvas = new OffscreenCanvas(this.header.width, this.header.height);
                var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, this.header.width, this.header.height);
                    ctx.drawImage(await IMAGE, 0, 0);
                this.blazer.context(ctx, canvas.width, canvas.height);
                let blob = blazer.encode(this.reader.chunks.filter((C)=>C.name!="JHDR"&&C.name!="JDAA"&&C.name!="JDAT"&&C.name!="JdAA"&&C.name!="IDAT"));
                return await loadImage(URL.createObjectURL(blob));
            }
            
            //
            //console.time("FastPNG");
            //const blob = await (canvas.convertToBlob || canvas.toBlob).call(canvas, {type: "image/png", quality: 1});
            //console.timeEnd("FastPNG");
            
            //const FR = new FileReader();
            //FR.readAsArrayBuffer(blob);
            //const READ = new Promise(resolve => {
                //FR.onload = ()=>resolve(FR.result);
            //});
            //return await new InjectPNG(this.reader.chunks, this.header).recode(await READ);
        }
        return null;
    }

}