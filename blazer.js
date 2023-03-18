import { OpenJNG } from "./lib/openjng.js"
import { BlazerPNG } from "./lib/png.js"
import { BlazerBMP } from "./lib/bmp.js"
import { DataReader } from "./lib/reader.js"

//
import * as utils from "./lib/utils.js"

//
export { OpenJNG, BlazerPNG, BlazerBMP, DataReader };
export * from "./lib/utils.js"
export * from "./lib/intercom.js"
export * from "./lib/idb-cache.js"

//
import { InterWork } from "./lib/intercom.js"

//
const WorkerLib = {};

//
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    const WC = new InterWork(self); WorkerLib.interwork = WC;
    const _module = {
        OpenJNG, BlazerPNG, BlazerBMP, OffscreenCanvas, WorkerLib, 
        ...utils
    };

    // will used for await ops (such as register)
    WC.register("idle", WorkerLib.idle = async()=> {
        return await new Promise(R=>R(_module));
    });

    //
    WC.instance(OffscreenCanvasRenderingContext2D, OffscreenCanvas, OpenJNG, BlazerPNG, BlazerBMP);
    WC.register("default", WorkerLib.library = _module);
    WC.observe();
}

//
export { WorkerLib };
