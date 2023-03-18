import { BlazerBMP, WorkCom } from "./blazer.js";

//
const _module = new WorkCom(self);

//
_module.instance(OffscreenCanvasRenderingContext2D, OffscreenCanvas, BlazerBMP);
_module.register("default", {
    BlazerBMP, OffscreenCanvas
});

//
//_module.initiate();
