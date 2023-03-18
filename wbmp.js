import { BlazerBMP, InterWork } from "./blazer.js";

//
const _module = new InterWork(self);

//
_module.instance(OffscreenCanvasRenderingContext2D, OffscreenCanvas, BlazerBMP);
_module.register("default", {
    BlazerBMP, OffscreenCanvas
});
_module.observe();

//
//_module.initiate();
