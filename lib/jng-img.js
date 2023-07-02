//
import { InterWork } from "./intercom.js"

// 
export let JNGImage = {};
if (!(typeof self != "undefined" && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)) {

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
}