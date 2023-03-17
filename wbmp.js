import { BlazerBMP } from "./blazer.js";
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

//
class OffscreenCanvasWrap {
    constructor(w,h,opt) {
        this._canvas = new OffscreenCanvas(w,h,opt);
    }

    getContext(name,opt) {
        return Comlink.proxy(this._canvas.getContext(name,opt));
    }

    get width() {
        return this._canvas.width;
    }

    get height() {
        return this._canvas.height;
    }
}

//
Comlink.expose({
    OffscreenCanvasWrap,
    BlazerBMP,
    OffscreenCanvasRenderingContext2D
});
