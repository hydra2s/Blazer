import { OpenJNG, WorkCom } from "./blazer.js";

//
const _module = new WorkCom(self);

//
_module.instance(OffscreenCanvasRenderingContext2D, OffscreenCanvas, OpenJNG);
_module.register("default", {
    OpenJNG, OffscreenCanvas
});
_module.observe();

//
//_module.initiate();
