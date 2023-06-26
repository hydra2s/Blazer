import { swap32 } from "./utils.js";
import * as CRC32 from "../deps/crc32.mjs";

// 
export class PNGChunk {
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

//
const _temp = {};
const _module = new Promise(async (R)=>{
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
    R(await (async url => instantiate(await (async () => {
            try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
            catch { return globalThis.WebAssembly.compile(await (await fetch(url)).arrayBuffer()); }
        })(), {env: {getPixelPack: (x,y,w,h,P)=>{ return _temp.getPixelPack(x,y,w,h,P); }}}
    ))(
        // for faster loading!
        `data:application/octet-binary;base64,AGFzbQEAAAABOQpgA39/fwBgAn9/AX9gBH9/f38AYAJ/fwBgAABgAX8Bf2AFf39/f38Bf2AAAX9gA39/fwF/YAF/AAIgAgNlbnYMZ2V0UGl4ZWxQYWNrAAYDZW52BWFib3J0AAIDGBcDAwAEBQEAAQEHCAEAAQAAAAICAgUJBAUEAQCAAgYQA38BQQALfwFBAAt/AUEACwdoCQhtYWtlQVJHQgAQCG1ha2VCR1JBABEIbWFrZVJHQkEAEghwcmVtYWtlQQATC21ha2VQTkdEYXRhABQSbWFrZVBOR0RhdGFfUkdCWDMyABUFYWxsb2MAFgRmcmVlABcGbWVtb3J5AgAIARgMAQwK1CIXzQEBBH8gASgCAEF8cSIDQYACSQR/IANBBHYFQR9B/P///wMgAyADQfz///8DTxsiA2drIgRBB2shAiADIARBBGt2QRBzCyEEIAEoAgghAyABKAIEIgUEQCAFIAM2AggLIAMEQCADIAU2AgQLIAEgACACQQR0IARqQQJ0aigCYEYEQCAAIAJBBHQgBGpBAnRqIAM2AmAgA0UEQCAAIAJBAnRqIgEoAgRBfiAEd3EhAyABIAM2AgQgA0UEQCAAIAAoAgBBfiACd3E2AgALCwsLtwIBBX8gAUEEaiABKAIAIgNBfHFqIgQoAgAiAkEBcQRAIAAgBBACIAEgA0EEaiACQXxxaiIDNgIAIAFBBGogASgCAEF8cWoiBCgCACECCyADQQJxBEAgAUEEaygCACIBKAIAIQYgACABEAIgASAGQQRqIANBfHFqIgM2AgALIAQgAkECcjYCACAEQQRrIAE2AgAgACADQXxxIgJBgAJJBH8gAkEEdgVBH0H8////AyACIAJB/P///wNPGyICZ2siA0EHayEFIAIgA0EEa3ZBEHMLIgIgBUEEdGpBAnRqKAJgIQMgAUEANgIEIAEgAzYCCCADBEAgAyABNgIECyAAIAVBBHQgAmpBAnRqIAE2AmAgACAAKAIAQQEgBXRyNgIAIAAgBUECdGoiACAAKAIEQQEgAnRyNgIEC4QBAQF/IAJBcHEgACgCoAwiAkEAIAFBE2pBcHFBBGsiAUEQayACRhsEQCACKAIAIQMgAUEQayEBCyABayICQRRJBEAPCyABIANBAnEgAkEIayICQQFycjYCACABQQA2AgQgAUEANgIIIAFBBGogAmoiAkECNgIAIAAgAjYCoAwgACABEAMLjwEBAn8/ACIAQQBMBH9BASAAa0AAQQBIBUEACwRAAAtBkAtBADYCAEGwF0EANgIAA0AgAUEXSQRAIAFBAnRBkAtqQQA2AgRBACEAA0AgAEEQSQRAIAFBBHQgAGpBAnRBkAtqQQA2AmAgAEEBaiEADAELCyABQQFqIQEMAQsLQZALQbQXPwBBEHQQBEGQCyQACy8AIABB/P///wNLBEBBoAhBoAlBygNBHRABAAtBDCAAQRNqQXBxQQRrIABBDE0bC6UBAQJ/IAFBgAJJBH8gAUEEdgVBHyABQQFBGyABZ2t0akEBayABIAFB/v///wFJGyIBZ2siA0EHayECIAEgA0EEa3ZBEHMLIQEgACACQQJ0aigCBEF/IAF0cSIBBH8gACABaCACQQR0akECdGooAmAFIAAoAgBBfyACQQFqdHEiAQR/IAAgACABaCIAQQJ0aigCBGggAEEEdGpBAnRqKAJgBUEACwsLZwECfyABKAIAIgNBfHEgAmsiBEEQTwRAIAEgAiADQQJxcjYCACABQQRqIAJqIgEgBEEEa0EBcjYCACAAIAEQAwUgASADQX5xNgIAIAFBBGogASgCAEF8cWoiACAAKAIAQX1xNgIACwuaAQECfyAAIAEQBiICEAciAUUEQD8AIgFBBCAAKAKgDCABQRB0QQRrR3QgAkEBQRsgAmdrdEEBa2ogAiACQf7///8BSRtqQf//A2pBgIB8cUEQdiIDIAEgA0obQABBAEgEQCADQABBAEgEQAALCyAAIAFBEHQ/AEEQdBAEIAAgAhAHIQELIAEoAgAaIAAgARACIAAgASACEAggAQuAAQEBfyAAQez///8DSwRAQaAIQeAIQf0AQR4QAQALIwBFBEAQBQsjACAAQRBqEAkiAiABNgIMIAIgADYCECMBIgAoAgghASACIAA2AgQgAiABNgIIIAEgAiABKAIEQQNxcjYCBCAAIAI2AggjAiACKAIAQXxxQQRqaiQCIAJBFGoLMAECf0EEQQEQCiEBQRBBBBAKIgAgATYCACAAIAE2AgQgAEEENgIIIABBBDYCDCAACzwAIAAgAhAJIgJBBGogAUEEaiABKAIAQXxx/AoAACABQYwLTwRAIAEgASgCAEEBcjYCACAAIAEQAwsgAguKAwEHfyAAQRRrIQIgAEGMC0kEQCABIAIoAgwQCiIDIAAgASACKAIQIgAgACABSxv8CgAAIAMPCyABQez///8DSwRAQaAIQeAIQY8BQR4QAQALIwIgAigCAEF8cUEEamskAiMARQRAEAULIAFBEGohBiAAQRBrIgJBjAtJBEAgAkEEayEAIAJBD3FBASACGwR/QQEFIAAoAgBBAXELGiMAIAAgBhAMIQAFAkAgAkEEayEAIAJBD3FBASACGwR/QQEFIAAoAgBBAXELGiMAIQMgBhAGIgQgACgCACIHQXxxIgVNBEAgAyAAIAQQCAwBCyAAQQRqIAAoAgBBfHFqIgIoAgAiCEEBcQRAIAVBBGogCEF8cWoiBSAETwRAIAMgAhACIAAgB0EDcSAFcjYCACADIAAgBBAIDAILCyADIAAgBhAMIQALCyAAQRRqIgBBFGsiAiABNgIQIAIoAgRBfHEgAjYCCCACKAIIIgEgAiABKAIEQQNxcjYCBCMCIAIoAgBBfHFBBGpqJAIgAAvJAQEEfyABIAAoAgxPBEAgAUEASARAQYAKQcAKQYIBQRYQAQALIAFBAWoiBSAAKAIIIgNLBEAgBUH8////A0sEQEHwCkHACkETQTAQAQALIAAoAgAiBEH8////AyADQQF0IgYgBkH8////A08bIgZBCCAFIAVBCE0bIgUgBSAGSRsiBRANIgYgA2pBACAFIANr/AsAIAQgBkcEQCAAIAY2AgAgACAGNgIECyAAIAU2AggLIAAgAUEBajYCDAsgASAAKAIEaiACOgAACyYAIAEgACgCDE8EQEGACkHACkHyAEEqEAEACyAAKAIEIAFqLQAAC/IBAQd/IAFBAnQiCEFwcSEEA0AgAiAHSwRAQQAgByABQQEgACAHIAhsahAAIQlBACEDA0AgAyAESQRAIAMgCWoiBSAF/QAEAP0MAwABAgcEBQYLCAkKDwwNDv0O/QsEACADQRBqIQMMAQsLIAQhAwNAIAMgCEkEQBALIgYoAgQaIAZBACADIAlqIgUtAAMQDiAGQQEgBS0AABAOIAZBAiAFLQABEA4gBkEDIAUtAAIQDiAFIAZBABAPOgAAIAUgBkEBEA86AAEgBSAGQQIQDzoAAiAFIAZBAxAPOgADIANBBGohAwwBCwsgB0EBaiEHDAELCwvyAQEHfyABQQJ0IghBcHEhBANAIAIgB0sEQEEAIAcgAUEBIAAgByAIbGoQACEJQQAhAwNAIAMgBEkEQCADIAlqIgUgBf0ABAD9DAIBAAMFBgQHCgkICw4NDA/9Dv0LBAAgA0EQaiEDDAELCyAEIQMDQCADIAhJBEAQCyIGKAIEGiAGQQAgAyAJaiIFLQACEA4gBkEBIAUtAAEQDiAGQQIgBS0AABAOIAZBAyAFLQADEA4gBSAGQQAQDzoAACAFIAZBARAPOgABIAUgBkECEA86AAIgBSAGQQMQDzoAAyADQQRqIQMMAQsLIAdBAWohBwwBCwsLMgECfyABQQJ0IQQDQCACIANLBEBBACADIAFBASAAIAMgBGxqEAAaIANBAWohAwwBCwsLuwEBBX8gAkECdCIHQXBxIQUDQCADIAZLBEAgACAGIAdBBmpsaiIIQQA6AAVBACAGIAJBASABEAAaQQAhBANAIAQgBUkEQCAIQQZqIARqIAEgBGr9AAQA/Qz/AAAA/wAAAP8AAAD/AAAA/U5BGP2rAf0LBAAgBEEQaiEEDAELCyAFIQQDQCAEIAdJBEAgCEEGaiAEaiABIARqKAIAQf8BcUEYdDYCACAEQQRqIQQMAQsLIAZBAWohBgwBCwsLiAUCBXsHf0EBIQogAkECdCIOQQFqIQ0DQCADIAxLBEAgACAMIA5BBmpsaiILIANBAWsgDEY6AAAgCyANOwEBIAsgDUF/czsBAyALQQA6AAVBACAMIAJBASALQQZqEAAa/QwAAAAAAAAAAAAAAAAAAAAAIA1BBXYiASAKbP0cACEF/QwAAAAAAAAAAAAAAAAAAAAAIQT9DAAAAAAAAAAAAAAAAAAAAAAgCf0cACEGIAFBBXQhAUEAIQkDQCABIAlLBEAgBSAE/a4BIQUgBCALQQVqIAlqIg/9AAQAIgf9ff1//a4BIA/9AAQQIgj9ff1//a4BIQQgBiAH/YkB/QwgAB8AHgAdABwAGwAaABkA/boBIAf9igH9DBgAFwAWABUAFAATABIAEQD9ugH9rgH9rgEgCP2JAf0MEAAPAA4ADQAMAAsACgAJAP26ASAI/YoB/QwIAAcABgAFAAQAAwACAAEA/boB/a4B/a4BIQYgCUEgaiEJDAELCyAKIAQgBP0MCAkKCwwNDg8AAQIDBAUGB/0O/a4BIgQgBP0MBAUGBwABAgMMDQ4PCAkKC/0O/a4B/RsAakHx/wNwIQogBiAFQQX9qwH9rgEiBCAE/QwICQoLDA0ODwABAgMEBQYH/Q79rgEiBCAE/QwEBQYHAAECAwwNDg8ICQoL/Q79rgH9GwBB8f8DcCEJA0AgASANSQRAIAkgCiALQQVqIAFqLQAAaiIKaiEJIAFBAWohAQwBCwsgCkHx/wNrIAogCkHx/wNPG0Hx/wNwIQogCUHx/wNwIQkgDEEBaiEMDAELCyAAIAMgDkEGamxqIAlBEHQgCnIiAEGA/oN4cUEIdyAAQf+B/AdxQQh4cjYCAAuQBgIJfwV7QQEhCCACQQJ0IgtBAWohDCALQXBxIQUDQCADIApLBEAgACAKIAtBBmpsaiIJIANBAWsgCkY6AAAgCSAMOwEBIAkgDEF/czsBAyAJQQA6AAVBACAKIAJBASABEAAaQQAhBANAIAQgBUkEQCAJQQZqIARqIgYgBv0ABAAgASAEav0ABAD9DP///wD///8A////AP///wD9Tv1Q/QsEACAEQRBqIQQMAQsLIAUhBANAIAQgC0kEQCAJQQZqIARqIgYgBigCACABIARqKAIAQf///wdxcjYCACAEQQRqIQQMAQsL/QwAAAAAAAAAAAAAAAAAAAAAIAxBBXYiBCAIbP0cACEP/QwAAAAAAAAAAAAAAAAAAAAAIQ79DAAAAAAAAAAAAAAAAAAAAAAgB/0cACEQIARBBXQhBEEAIQcDQCAEIAdLBEAgDyAO/a4BIQ8gDiAJQQVqIAdqIgb9AAQAIhH9ff1//a4BIAb9AAQQIg39ff1//a4BIQ4gECAR/YkB/QwgAB8AHgAdABwAGwAaABkA/boBIBH9igH9DBgAFwAWABUAFAATABIAEQD9ugH9rgH9rgEgDf2JAf0MEAAPAA4ADQAMAAsACgAJAP26ASAN/YoB/QwIAAcABgAFAAQAAwACAAEA/boB/a4B/a4BIRAgB0EgaiEHDAELCyAIIA4gDv0MCAkKCwwNDg8AAQIDBAUGB/0O/a4BIg0gDf0MBAUGBwABAgMMDQ4PCAkKC/0O/a4B/RsAakHx/wNwIQggECAPQQX9qwH9rgEiDSAN/QwICQoLDA0ODwABAgMEBQYH/Q79rgEiDSAN/QwEBQYHAAECAwwNDg8ICQoL/Q79rgH9GwBB8f8DcCEHA0AgBCAMSQRAIAcgCCAJQQVqIARqLQAAaiIIaiEHIARBAWohBAwBCwsgCEHx/wNrIAggCEHx/wNPG0Hx/wNwIQggB0Hx/wNwIQcgCkEBaiEKDAELCyAAIAMgC0EGamxqIAdBEHQgCHIiAEGA/oN4cUEIdyAAQf+B/AdxQQh4cjYCAAsTACMARQRAEAULIwAgABAJQQRqC0gBAX8gAEGMC08EQCMARQRAEAULIABBBGshASAAQQ9xQQEgABsEf0EBBSABKAIAQQFxCxogASABKAIAQQFyNgIAIwAgARADCwsZAEHUCUHQCTYCAEHYCUHQCTYCAEHQCSQBCwu3AgwAQYwICwE8AEGYCAsvAgAAACgAAABBAGwAbABvAGMAYQB0AGkAbwBuACAAdABvAG8AIABsAGEAcgBnAGUAQcwICwE8AEHYCAslAgAAAB4AAAB+AGwAaQBiAC8AcgB0AC8AdABjAG0AcwAuAHQAcwBBjAkLATwAQZgJCyUCAAAAHgAAAH4AbABpAGIALwByAHQALwB0AGwAcwBmAC4AdABzAEHsCQsBPABB+AkLKwIAAAAkAAAASQBuAGQAZQB4ACAAbwB1AHQAIABvAGYAIAByAGEAbgBnAGUAQawKCwEsAEG4CgshAgAAABoAAAB+AGwAaQBiAC8AYQByAHIAYQB5AC4AdABzAEHcCgsBLABB6AoLIwIAAAAcAAAASQBuAHYAYQBsAGkAZAAgAGwAZQBuAGcAdABoABcQc291cmNlTWFwcGluZ1VSTAVmYWxzZQ==`
    ));
});

// NOT FASTEST YET!
export class BlazerPNG {
    constructor() {
        this.toFree = [];
        this.PNGsignature = new Uint8Array([137,80,78,71,13,10,26,10]);
    }

    async init() {
        this._module = await _module;
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

    async encodeIDAT2() {
        var IDAT = new PNGChunk();
        var SIZE = 2 + this.h * (6 + this.w*4) + 4;
        var data = this._module.alloc(SIZE+4+4+4);
        var payload = this._module.alloc(this.w*4);

        //
        IDAT.length = SIZE;
        IDAT.name = "IDAT";
        IDAT.data = new Uint8Array(this._module.memory.buffer, data+8, SIZE);
        IDAT.view = new DataView(this._module.memory.buffer, data+8, SIZE);
        IDAT.view.setUint16(0, 0x7801, false);

        //
        this._module.premakeA(data+8+2,await this.Adraw(payload),this.w,this.h);
        this._module.makePNGData_RGBX32(data+8+2,await this.RGBdraw(payload),this.w,this.h);

        //
        IDAT.slice = new Uint8Array(this._module.memory.buffer, data, SIZE+4+4+4);
        this.chunks.push(IDAT.compile());
        this.toFree.push(data, payload);
        return this;
    }

    async encodeIDAT() {
        var IDAT = new PNGChunk();
        var SIZE = 2 + this.h * (6 + this.w*4) + 4;
        var data = this._module.alloc(SIZE+4+4+4);

        //
        IDAT.length = SIZE;
        IDAT.name = "IDAT";
        IDAT.data = new Uint8Array(this._module.memory.buffer, data+8, SIZE);
        IDAT.view = new DataView(this._module.memory.buffer, data+8, SIZE);
        IDAT.view.setUint16(0, 0x7801, false);

        //
        this._module.makePNGData(data+8+2,await this.RGBdraw(),this.w,this.h);

        //
        IDAT.slice = new Uint8Array(this._module.memory.buffer, data, SIZE+4+4+4);
        this.chunks.push(IDAT.compile());
        this.toFree.push(data);
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
        this.toFree.push(data);
        return this;
    }

    encodeIEND() {
        var IEND = new PNGChunk();
        var data = this._module.alloc(0+4+4+4);
        IEND.length = 0;
        IEND.slice = new Uint8Array(this._module.memory.buffer, data, 0+4+4+4);
        IEND.name = "IEND";
        this.chunks.push(IEND.compile());
        this.toFree.push(data);
        return this;
    }

    async encode(chunks, RGBdraw = ()=>{}, Adraw = null) {
        this.chunks = [...(chunks||[])].filter((C)=>{ return C.name != "IHDR" && C.name != "IDAT" && C.name != "IEND"; });
        this.RGBdraw = RGBdraw;
        this.Adraw = Adraw;
        
        // TODO: store IDAT for recoding
        this.encodeIHDR();
        await (this.Adraw ? this.encodeIDAT2 : this.encodeIDAT).call(this);
        this.encodeIEND();
        
        //
        chunks = this.chunks; this.chunks = [];

        //
        //chunks = this.chunks; this.chunks = [];
        const blob = new Blob([this.PNGsignature, ...chunks.map((chunk)=>{
            return chunk.slice;
        })], {type: "image/png"});

        // fix memory leak
        this.toFree.map(this._module.free.bind(this._module));
        this.toFree = [];

        //
        return blob;
    }

    async shared(imageData) {
        this.buffer = await (imageData.data?.buffer || imageData.data), this.w = await imageData.width, this.h = await imageData.height;
        _temp.getPixelPack = (x,y,w,h,P)=>{ new Uint32Array(this._module.memory.buffer, P, w).set(new Uint32Array(this.buffer, y*w*4, w)); return P; };
        return this;
    }

    async context(ctx) {
        this.ctx = await ctx, this.w = await ctx.canvas.width, this.h = await ctx.canvas.height;
        _temp.getPixelPack = (x,y,w,h,P)=>{ new Uint8Array(this._module.memory.buffer, P, w*h*4).set(new Uint8Array(this.ctx.getImageData(x,y,w,h).data.buffer)); return P; };
        return this;
    }
}
