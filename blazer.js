//
import { Float16Array, isFloat16Array, isTypedArray, getFloat16, setFloat16, f16round } from "./float16/browser/float16.mjs";

// 
import { OpenJNG } from "./lib/openjng.js"
import { BlazerPNG } from "./lib/png.js"
import { BlazerBMP } from "./lib/bmp.js"
import { BlazerRGBA } from "./lib/rgba.js"
import { DataReader } from "./lib/reader.js"
import { OpenMNG, MNGRenderer } from "./lib/openmng.js"
import { Zoom } from "./lib/zoom-mod.js"
import { convertPointFromPageToNode } from "./lib/geometry-utils.js"
import { Scrollable } from "./lib/scrollable.js"
import { Draggable } from "./lib/draggable.js"
import { SliderX } from "./lib/slider-x.js"
import { MarkDown } from "./lib/mark-down.js"
import { JNGImage } from "./lib/jng-img.js"

//
import * as utils from "./lib/utils.js"
//import * as apng from "./lib/apng.js"

//
export { OpenJNG, BlazerPNG, BlazerBMP, DataReader, BlazerRGBA , OpenMNG, MNGRenderer };
export * from "./lib/utils.js"
export * from "./lib/intercom.js"
//export * from "./lib/apng.js"
export * from "./float16/browser/float16.mjs"
import { InterWork } from "./lib/intercom.js"

//
const WorkerLib = {};

// TODO: support for shared worker libraries
if (typeof self != "undefined" && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    const WC = new InterWork(self); WorkerLib.interwork = WC;
    const _module = {
        OpenJNG, BlazerPNG, BlazerRGBA, BlazerBMP, OffscreenCanvas, WorkerLib, OpenMNG, MNGRenderer, 
        ...utils,
    };

    // will used for await ops (such as register)
    WC.register("idle", WorkerLib.idle = async()=> {
        return await new Promise(R=>R(_module));
    });

    //
    WC.instance(MNGRenderer, OffscreenCanvasRenderingContext2D, OffscreenCanvas, OpenMNG, OpenJNG, BlazerPNG, BlazerBMP);
    WC.register("default", WorkerLib.library = _module);
    WC.observe();
}

//
export { WorkerLib };
export { JNGImage };
