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
let JNGImage = {}; 
if (!(typeof self != "undefined" && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)) {

    /* */
    const _DOMMatrix_ = typeof DOMMatrix != "undefined" ? DOMMatrix : WebKitCSSMatrix;
    const ifNull = (a,b)=>((a != null) ? (a||0) : (b||0));
    const neg = (a)=>(-a);

    /* */
    if (typeof window != "undefined") {
        /* TODO: make public for optimization */
        const _identity_ = `matrix3d(
            1.0, 0.0, 0.0, 0.0, 
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        )`;

        /* TODO: make public for optimization */
        class Point {
            constructor(x, y, z) { this.x = x, this.y = y, this.z = z };

            transformBy(matrix) {
                var tmp = matrix.multiply(new _DOMMatrix_(_identity_).translate(this.x, this.y, this.z));
                return new Point(tmp.m41, tmp.m42, tmp.m43);
            }
        }

        
        const getTransformationMatrix = (element) => {
            let fromNodeTransform = new _DOMMatrix_(_identity_);
            let x = element;
            while (x && x !== x.ownerDocument.documentElement) {
                let transform = new _DOMMatrix_(_identity_);
                if (x.computedStyleMap) {
                    /* TODO: support of transform-origin */
                    const computed = x.computedStyleMap().get("transform");
                    transform = (computed && computed.value != "none") ? computed.toMatrix() : transform;
                } else {
                    try {
                        const computed = window.getComputedStyle(x, "").getPropertyValue("transform");
                        transform = (computed && computed != "none") ? new _DOMMatrix_(computed) : transform;
                    } catch(e) {};
                }

                // get transform origin for correction
                let origin = [(x.offsetWidth||0)/2, (x.offsetHeight||0)/2];
                try {
                    origin = window.getComputedStyle(x, "").getPropertyValue("transform-origin").split(" ").map((V)=>parseFloat(V.replace("px", ""))).map((_,i)=>ifNull(_, origin[i]));
                } catch(e) {};

                //
                if (transform) {
                    fromNodeTransform = new _DOMMatrix_(_identity_)
                        .translate(...origin)
                        .multiply(new _DOMMatrix_(_identity_)
                            .multiply(transform)
                            .translate(...origin.map(neg))
                        )
                        .multiply(fromNodeTransform);
                }
                x = x.parentNode || x?.getRootNode()?.host;
            }

            const w = element.offsetWidth;
            const h = element.offsetHeight;
            const p1 = new Point(0, 0, 0).transformBy(fromNodeTransform);
            const p2 = new Point(w, 0, 0).transformBy(fromNodeTransform);
            const p3 = new Point(w, h, 0).transformBy(fromNodeTransform);
            const p4 = new Point(0, h, 0).transformBy(fromNodeTransform);
            const left = Math.min(p1.x, p2.x, p3.x, p4.x);
            const top = Math.min(p1.y, p2.y, p3.y, p4.y);
            const rect = element.getBoundingClientRect();
            return new _DOMMatrix_(_identity_).translate((window.scrollX || window.pageXOffset) + rect.left - left, (window.scrollY || window.pageYOffset) + rect.top - top, 0).multiply(fromNodeTransform);
        }

        window.convertPointFromPageToNode = window.webkitConvertPointFromPageToNode || ((element, pageX, pageY) => {
            return new Point(pageX, pageY, 0).transformBy(getTransformationMatrix(element).inverse());
        });

        window.convertPointFromNodeToPage = window.webkitConvertPointFromNodeToPage || ((element, offsetX, offsetY) => {
            return new Point(offsetX, offsetY, 0).transformBy(getTransformationMatrix(element));
        });
    }


    //const _WC = new InterWork(new Worker("./blazer.js", {type: "module"}), true);
    const _TW = new Array(Math.min(navigator.hardwareConcurrency || 4, 8)).fill({ counter: 0 }).map((I)=>({
        ...I, worker: new InterWork(new Worker("./blazer.js", {type: "module"}), true),
    }));

    //
    const _WC = () => { // Penta-cure formula
        const _LESS = _TW[_TW.findIndex((E)=>(E.counter == Math.min(..._TW.map((I)=>I.counter))))];
        _LESS.counter++; return _LESS;
    };

    // TODO: new Image class
    try {
        customElements.define("img-jng", JNGImage = class extends HTMLImageElement {
            constructor() {
                super();

                //
                (this._empty = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=`);
                //this.src ||= this._empty;
                //this.style.setProperty("--display", "none", "");
                this.addEventListener("error", ()=> { /*this.src = this._empty; this.style.setProperty("--display", "none", "");*/ });
                this.addEventListener("load", ()=> { this.style.removeProperty("--display"); if (this.src != this._empty) { this.style.removeProperty("--content"); }});

                //
                this._loadJNG(this.getAttribute("srcjng"));
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
                if (!_value) return this; 

                // TODO: WeakRef support by InterCom
                const thread = _WC(), self = this, instance = thread.worker.proxy("default")["OpenJNG"].then((C)=>new C());

                //
                if (this._prevent) {
                    this.removeEventListener("contextmenu", this._prevent);
                    this.removeEventListener("dragstart", this._prevent);
                }

                // use lazy loading
                //self.loading = "lazy";
                self.decoding = "async";
                self.src ||= _value;

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
                    try { self.style.setProperty('--content', `url("${await instance.load(_value).then(URL.createObjectURL)}")`); self.style.removeProperty("--display"); } catch(e) {};
                    thread.counter--;

                    // ban actions by default
                    self.addEventListener("contextmenu", this._prevent ||= (e)=>{ e.preventDefault(); }, true);
                    self.addEventListener("dragstart", this._prevent, true);

                    //
                    return this.src;
                });

                //
                if (self.loading != "lazy") { this._src = typeof this._src == "function" ? this._src() : this._src; };

                //
                return this; 
            }

            disconnectedCallback() {
                this._observer.unobserve(this);
            }

            connectedCallback() {
                this._loadJNG(this.getAttribute("srcjng"));
                this._observer.observe(this);
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name == "srcjng" && oldValue != newValue && newValue != this._empty) {
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
                (this._empty = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=`);
                this._loadJNG(this.getAttribute("srcjng"));
                this._observer = new IntersectionObserver(()=>{
                    // activate a JNG image
                    this._src = typeof this._src == "function" ? this._src() : this._src;
                }, {
                    root: document.querySelector(':root'),
                    rootMargin: "0px",
                    threshold: 0.0,
                });
                
                //
                const self = (this.parentNode?.querySelector("img") || this.parentNode || this);
                //self.style.setProperty("--display", "none", "");
                self.addEventListener("error", ()=> { /*self.src = this._empty; self.style.setProperty("--display", "none", "");*/ });
                self.addEventListener("load", ()=> { self.style.removeProperty("--display"); if (this.srcset != this._empty) { self.style.removeProperty("--content"); }});
            }

            _loadJNG(_value) {
                if (!_value) return this;

                // TODO: WeakRef support by InterCom
                const thread = _WC(), self = (this.parentNode?.querySelector("img") || this.parentNode || this), instance = thread.worker.proxy("default")["OpenJNG"].then((C)=>new C());

                //
                if (this._prevent) {
                    self.removeEventListener("contextmenu", this._prevent);
                    self.removeEventListener("dragstart", this._prevent);
                }

                // use lazy loading
                //self.loading = "lazy";
                self.decoding = "async";
                this.srcset ||= _value;
                
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
                    try { self.style.setProperty('--content', `url("${await instance.load(_value).then(URL.createObjectURL)}")`); self.style.removeProperty("--display"); } catch(e) {};
                    thread.counter--;

                    // ban actions by default
                    self.addEventListener("contextmenu", this._prevent ||= (e)=>{ e.preventDefault(); }, true);
                    self.addEventListener("dragstart", this._prevent, true);

                    //
                    return this.srcset;
                });

                //
                if (self.loading != "lazy") { this._src = typeof this._src == "function" ? this._src() : this._src; };

                //
                return this;
            }

            disconnectedCallback() {
                this._observer.unobserve(this.parentNode?.querySelector("img") || this.parentNode || this);
            }

            connectedCallback() {
                this._loadJNG(this.getAttribute("srcjng"));
                this._observer.observe(this.parentNode?.querySelector("img") || this.parentNode || this);
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name == "srcjng" && oldValue != newValue && newValue != this._empty) {
                    this._loadJNG(newValue);
                }
            }

            static get observedAttributes() {
                return ['srcjng'];
            }
        }, { extends: "source" });
    } catch(e) {};

    try {
        
        customElements.define("scroll-able", class Scrollable extends HTMLElement {
            constructor() {
                super();

                // wlop-elements
                this._topLeftP = document.createElement("div"); this._topLeftP.classList.add("top-left");
                this._topRightP = document.createElement("div"); this._topRightP.classList.add("top-right");
                this._bottomLeftP = document.createElement("div"); this._bottomLeftP.classList.add("bottom-left");
                this._bottomRightP = document.createElement("div"); this._bottomRightP.classList.add("bottom-right");
                this._points = [this._topLeftP, this._topRightP, this._bottomLeftP, this._bottomRightP];

                //
                this._scrollX = document.createElement("div");
                this._scrollY = document.createElement("div");
                this._scrollable = document.createElement("div");
                this._slot = document.createElement("slot");
                this._style = document.createElement("style");

                //
                window.addEventListener("beforeunload", this._saveToStorage.bind(this));
                window.addEventListener("resize", ()=> { this._updateSize()._updateScroll(); });
                document.addEventListener("resize", ()=> { this._updateSize()._updateScroll(); });
                this.addEventListener("resize", ()=> { this._updateSize()._updateScroll(); });

                //
                this._scrollable.addEventListener("resize", ()=> { this._updateSize()._updateScroll() });
                this._scrollable.addEventListener("scroll", ()=> { this._updateSize()._updateScroll() });

                //
                this._trackX = document.createElement("div");
                this._trackY = document.createElement("div");

                //
                this._trackX.classList.add("track");
                this._trackY.classList.add("track");
                this._scrollX.classList.add("scroll-x");
                this._scrollY.classList.add("scroll-y");
                this._scrollable.classList.add("scrollable");

                //
                this.attachShadow({ mode: "open" });

                //
                this._points.forEach((E)=>this.shadowRoot.appendChild(E));
                this.shadowRoot.appendChild(this._style);
                this.shadowRoot.appendChild(this._scrollX);
                this.shadowRoot.appendChild(this._scrollY);
                this.shadowRoot.appendChild(this._scrollable);
                this._scrollX.appendChild(this._trackX);
                this._scrollY.appendChild(this._trackY);

                //
                this.handleDrag = (e)=>{
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    return false;
                }

                //
                this._blank = document.createElement('canvas');
                this._blank.width = 1;
                this._blank.height = 1;
                this._blank.style.display = "none";

                //
                {
                    this._trackX.draggable = false;
                    this._trackX.addEventListener("selectstart", (e)=> { e.preventDefault(); return false; });

                    this._sX = 0;
                    this._scrollingX = -1;
                    this._trackX.parentNode.addEventListener("pointerdown", (e)=> {
                        if (!document.body.classList.contains("dragging")) {
                            document.body.classList.add("dragging");
                        }
                        this._scrollingX = e.pointerId;
                        this._sX = e.offsetX;
                        this._updateSize()._updateScroll();
                    });
                }

                {
                    this._trackY.draggable = false;
                    this._trackY.addEventListener("selectstart", (e)=> { e.preventDefault(); return false; });

                    this._sY = 0;
                    this._scrollingY = -1;
                    this._trackY.parentNode.addEventListener("pointerdown", (e)=> {
                        if (!document.body.classList.contains("dragging")) {
                            document.body.classList.add("dragging");
                        }
                        this._scrollingY = e.pointerId;
                        this._sY = e.offsetY;
                        this._updateSize()._updateScroll();
                    });
                }

                {
                    document.addEventListener("pointermove", (e)=> {
                        if (this._scrollingX == e.pointerId) {
                            const offsetX = window.convertPointFromPageToNode(this._trackX.parentNode, e.clientX, e.clientY).x - this._sX;
                            this._trackX.style.setProperty("--offsetPercent", this._spcX = Math.min(Math.max((offsetX) / (this._trackX.parentNode.offsetWidth - this._trackX.offsetWidth), 0.0), 1.0), "");
                            this._scrollable.scrollTo({
                                left: this._spcX * (this._scrollable.scrollWidth - this._scrollable.offsetWidth),
                                behavior: "instant"
                            });
                        }
                        if (this._scrollingY == e.pointerId) {
                            const offsetY = window.convertPointFromPageToNode(this._trackY.parentNode, e.clientX, e.clientY).y - this._sY;
                            this._trackY.style.setProperty("--offsetPercent", this._spcY = Math.min(Math.max((offsetY) / (this._trackY.parentNode.offsetHeight - this._trackY.offsetHeight), 0.0), 1.0), "");
                            this._scrollable.scrollTo({
                                top: this._spcY * (this._scrollable.scrollHeight - this._scrollable.offsetHeight),
                                behavior: "instant"
                            });
                        }
                    });

                    //
                    document.addEventListener("pointerup", (e)=> {
                        if (this._scrollingY == e.pointerId || this._scrollingX == e.pointerId) { document.body.classList.remove("dragging"); };
                        if (this._scrollingY == e.pointerId) { this._scrollingY = -1; }
                        if (this._scrollingX == e.pointerId) { this._scrollingX = -1; }
                    });
                }

                //
                this._scrollable.appendChild(this._slot);
                this._style.textContent = `
                /* TODO: scrolling library! */
                :host {
                    /* don't override! */
                    position: relative !important;
                    top: 0; bottom: 0; left: 0; right: 0;
                    display: inline-block;
                    overflow: hidden;

                    /* */
                    max-width: min(100%, 100vw);
                    max-height: min(100%, 100vh);
                    min-width: min-content;
                    min-height: min-content;

                    /* un-preferred */
                    width: min(100%, 100vw);
                    height: min(100%, 100vh);
                    padding: 0px;
                    margin: 0px;

                    /* not supported... */
                    /*width: max-content;
                      height: max-content;*/

                    /* */
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -o-user-select: none;
                    user-select: none;

                    /* */
                    --padding-left: 0px;
                    --padding-right: 0px;
                    --padding-top: 0px;
                    --padding-bottom: 0px;
                }

                :host, :host * {
                    /* */
                    -webkit-backface-visibility: hidden;
                    -moz-backface-visibility: hidden;
                    -ms-backface-visibility: hidden;
                    backface-visibility: hidden;
                
                    /* */
                    -webkit-perspective: 1000;
                    -moz-perspective: 1000;
                    -ms-perspective: 1000;
                    perspective: 1000;
                
                    /* Enable hardware acceleration */
                    -webkit-transform: translate3d(0, 0, 0);
                    -moz-transform: translate3d(0, 0, 0);
                    -ms-transform: translate3d(0, 0, 0);
                    transform: translate3d(0, 0, 0);

                    /* */
                    transform-origin: 50% 50%;
                
                    /* Some filter hack */
                    filter: grayscale(0%);
                }

                /* Descended elements */
                .top-left, .top-right, .bottom-left, .bottom-right {
                    z-index: -1;
                    position: absolute;
                    pointer-events: none;
                    opacity: 0;
                    display: block;
                    width: 0;
                    height: 0;
                    line-height: 0;
                    overflow: hidden;
                    color: transparent;
                    background-color: transparent;
                    content-visibility: hidden;
                    visibility: hidden;
                }

                .top-right {
                    top: calc(0px - var(--padding-top));
                    left: auto;
                    bottom: auto;
                    right: calc(0px - var(--padding-right));
                    float: right;
                }

                .top-left {
                    top: calc(0px - var(--padding-top));
                    left: calc(0px - var(--padding-left));
                    bottom: auto;
                    right: auto;
                    float: left;
                }

                .bottom-right {
                    top: auto;
                    left: auto;
                    bottom: calc(0px - var(--padding-bottom));
                    right: calc(0px - var(--padding-right));
                    float: right;
                }

                .bottom-left {
                    top: auto;
                    left: calc(0px - var(--padding-left));
                    bottom: calc(0px - var(--padding-bottom));
                    right: auto;
                    float: left;
                }

                .scrollable {
                    /* */
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -o-user-select: none;
                    user-select: none;
                
                    /* */
                    -webkit-user-drag: none;
                    -khtml-user-drag: none;
                    -moz-user-drag: none;
                    -o-user-drag: none;
                    user-drag: none;

                    /* */
                    text-align: center;
                    position: relative;
                    top: 0; left: 0; right: 0; bottom: 0;

                    /* */
                    display: block;
                    width: min(100%, 100vw);
                    height: min(100%, 100vh);

                    /* */
                    max-width: min(100%, 100vw);
                    max-height: min(100%, 100vh);

                    /* */
                    min-height: min(100%, 100vw);//min-content;
                    min-width: min(100%, 100vw);//min-content;

                    /* */
                    position: absolute;
                    left: 0; top: 0; right: 0; bottom: 0;
 
                    /* */
                    overflow: auto;
                    overflow: overlay;
                    touch-action: none;

                    /* */
                    scrollbar-gutter: stable both-edges;
                    scrollbar-width: thin;
                    scrollbar-width: none;
                    scroll-behavior: smooth;
                }

                .scroll-y .track {
                    --offsetPercent: 0.0;

                    width: 100%;
                    height: var(--ownSize);
                    transform: translateY(
                        calc(
                            var(--offsetPercent) * 
                            calc(100% - var(--ownSize))
                        )
                    );
                }

                .scroll-x .track {
                    --offsetPercent: 0.0;

                    height: 100%;
                    width: var(--ownSize);
                    transform: translateX(
                        calc(
                            var(--offsetPercent) * 
                            calc(var(100% - var(--ownSize))
                        )
                    );
                }

                /* */
                .scroll-y {
                    height: calc(100% - 1rem);
                    width: 1rem;

                    top: 0px;
                    right: 0px;
                    left: auto;
                }
                
                /* */
                .scroll-x {
                    width: calc(100% - 1rem);
                    height: 1rem;
                    
                    left: 0px;
                    bottom: 0px;
                    top: auto;
                }

                /* */
                .scroll-x, .scroll-y {
                    overflow: hidden;
                    position: absolute;
                    background-color: transparent;
                    pointer-events: none;
                    z-index: 9999;
                }
                
                /* */
                .scroll-x .track, .scroll-y .track {
                    /* for touch screen */
                    /*position: sticky; */

                    /* */
                    overflow: hidden;
                    background-color: rgba(0, 0, 0, 0.5);
                    cursor: grab;
                    display: block;
                    pointer-events: auto;

                    /* */
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -o-user-select: none;
                    user-select: none;
                }

                .scroll-x .track:active, .scroll-y .track:active {
                    cursor: move; /* fallback: no url() support or images disabled */
                    cursor: -webkit-grabbing; /* Chrome 1-21, Safari 4+ */
                    cursor:    -moz-grabbing; /* Firefox 1.5-26 */
                    cursor:         grabbing; /* W3C standards syntax, should come least */
                }
`;

                requestAnimationFrame(()=>{
                    this._updateSize()._loadFromStorage()._saveToStorage()._updateScroll();
                });
                document.addEventListener("DOMContentLoaded", ()=>{
                    this._updateSize()._loadFromStorage()._saveToStorage()._updateScroll();
                });

                //
                return this;
            }

            _saveToStorage() {
                if (this.hasAttribute("storage")) {
                    if (this._spcX != null) { localStorage.setItem(this.getAttribute("storage") + "_scX", this._spcX); };
                    if (this._spcY != null) { localStorage.setItem(this.getAttribute("storage") + "_scY", this._spcY); };
                }
                return this;
            }

            _loadFromStorage() {
                if (this.hasAttribute("storage")) {
                    if (this._spcX == null) { this._trackX.style.setProperty("--offsetPercent", this._spcX = localStorage.getItem(this.getAttribute("storage") + "_scX"), ""); };
                    if (this._spcY == null) { this._trackY.style.setProperty("--offsetPercent", this._spcY = localStorage.getItem(this.getAttribute("storage") + "_scY"), ""); };
                    this._scrollable.scrollTo({
                        left: this._spcX * (this._scrollable.scrollWidth - this._scrollable.offsetWidth),
                        top: this._spcY * (this._scrollable.scrollHeight - this._scrollable.offsetHeight),
                        behavior: "instant"
                    });
                }
                return this;
            }

            _updateScroll() {
                if (this._scrollingY < 0) { this._trackY.style.setProperty("--offsetPercent", this._spcY = (this._scrollable.scrollTop / (this._scrollable.scrollHeight - this._scrollable.offsetHeight)), ""); };
                if (this._scrollingX < 0) { this._trackX.style.setProperty("--offsetPercent", this._spcX = (this._scrollable.scrollLeft / (this._scrollable.scrollWidth - this._scrollable.offsetWidth)), ""); };
                return this;
            }

            _updateSize() {
                const tX = this._trackX;
                const tY = this._trackY;

                tX.style.setProperty("--ownSize", (tX.parentNode.offsetWidth * (this._scrollCoefX = this._scrollable.offsetWidth / this._scrollable.scrollWidth)) + "px", "");
                tX.style.setProperty("--parentSize", tX.parentNode.offsetWidth + "px", "");

                tY.style.setProperty("--ownSize", (tY.parentNode.offsetHeight * (this._scrollCoefY = this._scrollable.offsetHeight / this._scrollable.scrollHeight)) + "px", "");
                tY.style.setProperty("--parentSize", tY.parentNode.offsetHeight + "px", "");

                if (this._scrollCoefX >= 1) { tX.style.setProperty("opacity", "0.0", ""); tX.style.setProperty("pointer-events", "none", ""); } else { tX.style.removeProperty("opacity"); tX.style.removeProperty("pointer-events"); };
                if (this._scrollCoefY >= 1) { tY.style.setProperty("opacity", "0.0", ""); tY.style.setProperty("pointer-events", "none", ""); } else { tY.style.removeProperty("opacity"); tY.style.removeProperty("pointer-events"); };
                
                return this;
            }

            disconnectedCallback() {
                
            }

            connectedCallback() {
                requestAnimationFrame(()=>{
                    this._updateSize()._loadFromStorage()._saveToStorage()._updateScroll();
                });
                document.addEventListener("DOMContentLoaded", ()=>{
                    this._updateSize()._loadFromStorage()._saveToStorage()._updateScroll();
                });
            }

            attributeChangedCallback(name, oldValue, newValue) {
                
            }

            static get observedAttributes() {
                return [];
            }
        });
    } catch(e) {};



    try {
        customElements.define("slider-x", class SliderX extends HTMLElement {
            constructor() {
                super();

                //
                this._scrollX = document.createElement("div");
                this._scrollY = document.createElement("div");
                this._scrollable = document.createElement("div");
                this._slot = document.createElement("slot");
                this._style = document.createElement("style");

                //
                this._scrollX.classList.add("scroll-x");
                this._scrollY.classList.add("scroll-y");
                this._scrollable.classList.add("scrollable");

                const E = this._scrollable;
                E.addEventListener("wheel", (e)=>{
                    e.preventDefault();
    
                    // abuse a scrolling bug?
                    if (e.deltaY > 0) { E.scrollBy( 10, 0); };
                    if (e.deltaY < 0) { E.scrollBy(-10, 0); };
                });

                //
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(this._style);
                this.shadowRoot.appendChild(this._scrollX);
                this.shadowRoot.appendChild(this._scrollY);
                this.shadowRoot.appendChild(this._scrollable);

                //
                this._scrollable.appendChild(this._slot);
                this._style.textContent = `
                /* TODO: scrolling library! */
                :host {
                    min-width: min-content;
                    min-height: min-content;

                    width: min-content;
                    height: min-content;

                    max-width: min(100%, 100vw);
                    max-height: min(100%, 100vh);

                    display: inline-block;
                    position: relative;
                    overflow: hidden;

                    padding: 0px;
                    margin: 0px;

                    
                }

                .scrollable > ::slotted(*) {
                    flex: 0 0 100%;
                    aspect-ratio: 16 / 9;
                
                    max-width: min(100%, 100vw);
                    max-height: min(100%, 100vh);

                    left: 0px;
                    top: 0px;
                    bottom: 0px;
                    right: 0px;
                    display: inline-block;
                    overflow: hidden;
                
                    /* */
                    margin: 0;
                    padding: 0;
                
                    /* */
                    scroll-snap-align: center;
                }
                
                .scrollable {
                    display: inline-flex;
                    flex-direction: row;

                    /* use overlay scroll-bars library */
                    scrollbar-gutter: stable both-edges;
                    scrollbar-width: thin;
                    scrollbar-width: none;
                    scroll-behavior: smooth;
                
                    /* */
                    overflow: hidden;
                    overflow-y: hidden;
                    overflow-x: scroll;
                
                    /* */
                    scroll-snap-type: x mandatory;
                    scroll-margin-left: 0;
                
                    /* */
                    touch-action: pan-x;
                
                    /* */
                    margin: 0;
                    padding: 0;
                }

`;

                //
                return this;
            }

            disconnectedCallback() {
                
            }

            connectedCallback() {
                
            }

            attributeChangedCallback(name, oldValue, newValue) {
                
            }

            static get observedAttributes() {
                return [];
            }
        });
    } catch(e) {};





}

export { JNGImage };
