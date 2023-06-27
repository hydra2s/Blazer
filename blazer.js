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
                this.src ||= `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=`;

                //
                this.style.setProperty("display", "none", "");
                this.addEventListener("error", ()=> this.style.setProperty("display", "none", ""));
                this.addEventListener("load", ()=> this.style.removeProperty("display"));

                //
                this._WC = new InterWork(new Worker("./blazer.js", {type: "module"}), true);
                this._loadJNG(this.getAttribute("srcjng"));
                this._observer = new IntersectionObserver(()=>{
                    // activate a JNG image
                    this._src = typeof this._src == "function" ? this._src() : this._src;
                }, {
                    root: document.querySelector(':root'),
                    rootMargin: "0px",
                    threshold: 0.0,
                });
                this._class = this._WC.proxy("default")["OpenJNG"];
                
            }

            _loadJNG(_value) {
                if (this._prevent) {
                    this.removeEventListener("contextmenu", this._prevent);
                    this.removeEventListener("dragstart", this._prevent);
                }

                //
                if (!_value) return this; 
                const self = this;

                // use lazy loading
                self.loading = "lazy";
                self.decoding = "async";

                // for observer
                this._src = (async ()=>{
                    // optimize image loading
                    self.fetchPriority = "high";
                    self.crossOrigin = "anonymous";
                    self.loading = "eager";
                    self.decoding = "async";
                    self.async = true;
                    self.draggable = false;

                    // 
                    try { this._jng ||= await this._class.then((C)=>new C()); } catch(e) {};
                    try { this.src = await this._jng.load(_value).then(URL.createObjectURL); } catch(e) {};

                    // ban actions by default
                    self.addEventListener("contextmenu", this._prevent ||= (e)=>{ e.preventDefault(); }, true);
                    self.addEventListener("dragstart", this._prevent, true);

                    //
                    return this.src;
                });

                //
                return this; 
            }

            disconnectedCallback() {
                this._observer.unobserve(this);
            }

            connectedCallback() {
                this.src ||= `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=`;
                this._loadJNG(this.getAttribute("srcjng"));
                this._observer.observe(this);
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name == "srcjng" && oldValue != newValue) {
                    this._loadJNG(newValue);
                }
            }

            static get observedAttributes() {
                return ['srcjng'];
            }
        }, { extends: "img" });
    } catch(e) {};

    try {
        customElements.define("source-jng", class JNGSource extends HTMLSourceElement {
            constructor() {
                super();

                //
                this.srcset ||= `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=`;
                this._WC = new InterWork(new Worker("./blazer.js", {type: "module"}), true);
                this._loadJNG(this.getAttribute("srcjng"));
                this._observer = new IntersectionObserver(()=>{
                    // activate a JNG image
                    this._src = typeof this._src == "function" ? this._src() : this._src;
                }, {
                    root: document.querySelector(':root'),
                    rootMargin: "0px",
                    threshold: 0.0,
                });
                this._class = this._WC.proxy("default")["OpenJNG"];

                //
                const self = (this.parentNode?.querySelector("img") || this.parentNode || this);
                self.style.setProperty("display", "none", "");
                self.addEventListener("error", ()=> self.style.setProperty("display", "none", ""));
                self.addEventListener("load", ()=> self.style.removeProperty("display"));
            }

            _loadJNG(_value) {
                if (!_value) return this; 

                //
                const self = (this.parentNode?.querySelector("img") || this.parentNode || this);

                //
                if (this._prevent) {
                    self.removeEventListener("contextmenu", this._prevent);
                    self.removeEventListener("dragstart", this._prevent);
                }

                // use lazy loading
                self.loading = "lazy";
                self.decoding = "async";
                
                // for observer
                this._src = (async ()=>{
                    // optimize image loading
                    self.fetchPriority = "high";
                    self.crossOrigin = "anonymous";
                    self.loading = "eager";
                    self.decoding = "async";
                    self.async = true;
                    self.draggable = false;

                    // 
                    try { this._jng ||= await this._class.then((C)=>new C()); } catch(e) {};
                    try { this.srcset = await this._jng.load(_value).then(URL.createObjectURL); this.type = "image/png"; } catch(e) {};

                    // ban actions by default
                    self.addEventListener("contextmenu", this._prevent ||= (e)=>{ e.preventDefault(); }, true);
                    self.addEventListener("dragstart", this._prevent, true);

                    //
                    return this.srcset;
                });

                //
                return this;
            }

            disconnectedCallback() {
                this._observer.unobserve(this.parentNode?.querySelector("img") || this.parentNode || this);
            }

            connectedCallback() {
                this.srcset ||= `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=`;
                this._loadJNG(this.getAttribute("srcjng"));
                this._observer.observe(this.parentNode?.querySelector("img") || this.parentNode || this);
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name == "srcjng" && oldValue != newValue) {
                    this._loadJNG(newValue);
                }
            }

            static get observedAttributes() {
                return ['srcjng'];
            }
        }, { extends: "source" });
    } catch(e) {};

}

