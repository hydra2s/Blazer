import { OpenJNG } from "./lib/openjng.js"
import { BlazerPNG } from "./lib/png.js"
import { BlazerBMP } from "./lib/bmp.js"
import { BlazerRGBA } from "./lib/rgba.js"
import { DataReader } from "./lib/reader.js"
import { OpenMNG, MNGRenderer } from "./lib/openmng.js"

//
import * as utils from "./lib/utils.js"
import * as apng from "./lib/apng.js"

//
export { OpenJNG, BlazerPNG, BlazerBMP, DataReader, BlazerRGBA , OpenMNG, MNGRenderer };
export * from "./lib/utils.js"
export * from "./lib/intercom.js"
export * from "./lib/idb-cache.js"
export * from "./lib/apng.js"

//
import { InterWork } from "./lib/intercom.js"

//
const WorkerLib = {};

// TODO: support for shared worker libraries
if (typeof self != "undefined" && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    const WC = new InterWork(self); WorkerLib.interwork = WC;
    const _module = {
        OpenJNG, BlazerPNG, BlazerRGBA, BlazerBMP, OffscreenCanvas, WorkerLib, OpenMNG, MNGRenderer, 
        ...utils, ...apng
    };

    // will used for await ops (such as register)
    WC.register("idle", WorkerLib.idle = async()=> {
        return await new Promise(R=>R(_module));
    });

    //
    WC.instance(MNGRenderer, OffscreenCanvasRenderingContext2D, OffscreenCanvas, OpenMNG, OpenJNG, BlazerPNG, BlazerBMP, apng.APNGFrame, apng.APNGControl);
    WC.register("default", WorkerLib.library = _module);
    WC.observe();
}

//
export { WorkerLib };

// 
if (!(typeof self != "undefined" && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)) {

    // TODO: new Image class
    try {
        customElements.define("img-jng", class JNGImage extends HTMLImageElement {
            constructor() {
                super();

                //
                this._WC = new InterWork(new Worker("./blazer.js", {type: "module"}), true);
                this._loadJNG(this.getAttribute("src-jng"));
                this._observer = new IntersectionObserver(()=>{
                    // activate a JNG image
                    this._src = typeof this._src == "function" ? this._src() : this._src;
                }, {
                    root: document.querySelector(':root'),
                    rootMargin: "0px",
                    threshold: 0.0,
                });
            }

            _loadJNG(_value) {

                // use lazy loading
                this.loading = "lazy";
                this.decoding = "async";

                // for observer
                this._src = (async ()=>{
                    // optimize image loading
                    this.fetchPriority = "high";
                    this.crossOrigin = "anonymous";
                    this.loading = "eager";
                    this.decoding = "async";
                    this.async = true;

                    //this._src = typeof this._src == "function" ? this._src() : this._src;
                    try { this._jng ||= await new ((await this._WC.proxy("default"))["OpenJNG"])(); } catch(e) {};
                    try { return (this.src ||= URL.createObjectURL(await this._jng.load(_value))); } catch(e) {};
                    return this.src;
                });
            }

            disconnectedCallback() {
                this._observer.unobserve(this);
            }

            connectedCallback() {
                this._loadJNG(this.getAttribute("src-jng"));
                this._observer.observe(this);
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name == "src-jng" && oldValue != newValue) {
                    this._loadJNG(newValue);
                }
            }

            static get observedAttributes() {
                return ['src-jng'];
            }
        }, { extends: "img" });
    } catch(e) {}

}
