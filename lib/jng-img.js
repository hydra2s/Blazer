//
import { InterWork } from "./intercom.js"
export let JNGImage = {};
if (!(typeof self != "undefined" && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)) {

    //const _WC = new InterWork(new Worker("./blazer.js", {type: "module"}), true);
    const _TW = new Array(Math.min(navigator.hardwareConcurrency || 4, 8)).fill({ counter: 0 }).map((I)=>{
        const worker = new InterWork(new Worker("./blazer.js", {type: "module"}), true);
        return { ...I, worker, get instance() {
            return worker.proxy("default")["OpenJNG"].then((C)=>new C());
        } };
    });

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
                (this._empty = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=`);
                this.addEventListener("error", (e)=> { e.preventDefault(); 
                    this._loadJNG(this.src);
                });
                this.addEventListener("load", (e)=> { e.preventDefault(); 
                    this.style.removeProperty("--content");
                    this.style.removeProperty("--display");
                });

                //
                const _src_ = this.src;
                this.src = "";
                this.src = _src_;

                //
                this._observer = new IntersectionObserver(()=>{
                    this._activate();
                }, {
                    root: document.querySelector(':root'),
                    rootMargin: "0px",
                    threshold: 0.0,
                });
            }

            _activate() {
                this._src = typeof this._src == "function" ? this._src() : this._src;
            }

            _loadJNG(_value) {
                if (!_value) return this; 

                // TODO: WeakRef support by InterCom
                const thread = _WC(), instance = thread.instance, self = this;

                //
                if (this._prevent) {
                    this.removeEventListener("contextmenu", this._prevent);
                    this.removeEventListener("dragstart", this._prevent);
                }

                // use lazy loading
                //self.loading = "lazy";
                self.decoding = "async";
                //self.src ||= _value;

                // for observer
                this.style.removeProperty("--content");
                this._src = (async ()=>{
                    // optimize image loading
                    self.fetchPriority = "high";
                    self.crossOrigin = "anonymous";
                    self.loading = "eager";
                    self.decoding = "async";
                    self.async = true;
                    self.draggable = false;

                    // 
                    try { self.style.setProperty('--content', `url("${await instance.load(_value).then(URL.createObjectURL)}")`); self.style.removeProperty("--display"); } catch(e) { console.error(e); };
                    thread.counter--;

                    // ban actions by default
                    self.addEventListener("contextmenu", this._prevent ||= (e)=>{ e.preventDefault(); }, true);
                    self.addEventListener("dragstart", this._prevent, true);

                    //
                    return _value;
                });

                //
                //if (self.loading != "lazy") 
                { this._activate(); };

                //
                return this; 
            }

            disconnectedCallback() {
                (this._observer.unobserve||this._observer.disconnect).call(this._observer, this);
            }

            connectedCallback() {
                this._observer.observe(this);
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name == "src" && newValue != oldValue && newValue != this._empty) {
                }
            }

            static get observedAttributes() {
                return ['src'];
            }
        }, { extends: "img" });
    } catch(e) {};

    try {
        customElements.define("source-jng", class JNGSource extends HTMLSourceElement {
            constructor() {
                super();
                (this._empty = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=`);
                const self = (this.parentNode?.querySelector("img") || this.parentNode || this);
                self.addEventListener("error", (e)=> { e.preventDefault(); 
                    this._loadJNG(this.srcset);
                });
                self.addEventListener("load", (e)=> { e.preventDefault(); 
                    self.style.removeProperty("--display"); 
                    self.style.removeProperty("--content"); 
                });

                //
                const _src_ = this.srcset;
                this.srcset = "";
                this.srcset = _src_;

                //
                this._observer = new IntersectionObserver(()=>{
                    this._activate();
                }, {
                    root: document.querySelector(':root'),
                    rootMargin: "0px",
                    threshold: 0.0,
                });
            }

            _activate() {
                this._src = typeof this._src == "function" ? this._src() : this._src;
            }

            _loadJNG(_value) {
                if (!_value) return this;

                // TODO: WeakRef support by InterCom
                const thread = _WC(), instance = thread.instance, self = (this.parentNode?.querySelector("img") || this.parentNode || this)

                //
                if (this._prevent) {
                    self.removeEventListener("contextmenu", this._prevent);
                    self.removeEventListener("dragstart", this._prevent);
                }

                // use lazy loading
                //self.loading = "lazy";
                self.decoding = "async";
                //this.srcset ||= _value;
                
                // for observer
                self.style.removeProperty("--content");
                this._src = (async ()=>{
                    // optimize image loading
                    self.fetchPriority = "high";
                    self.crossOrigin = "anonymous";
                    self.loading = "eager";
                    self.decoding = "async";
                    self.async = true;
                    self.draggable = false;

                    // 
                    try { self.style.setProperty('--content', `url("${await instance.load(_value).then(URL.createObjectURL)}")`); self.style.removeProperty("--display"); } catch(e) { console.error(e); };
                    thread.counter--;

                    // ban actions by default
                    self.addEventListener("contextmenu", this._prevent ||= (e)=>{ e.preventDefault(); }, true);
                    self.addEventListener("dragstart", this._prevent, true);

                    //
                    return _value;
                });

                //
                //if (self.loading != "lazy") 
                { this._activate(); };

                //
                return this;
            }

            disconnectedCallback() {
                (this._observer.unobserve||this._observer.disconnect).call(this._observer, this.parentNode?.querySelector("img") || this.parentNode || this);
            }

            connectedCallback() {
                this._observer.observe(this.parentNode?.querySelector("img") || this.parentNode || this);
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name == "srcset" && newValue != oldValue && newValue != this._empty) {
                }
            }

            static get observedAttributes() {
                return ['src', 'srcset'];
            }
        }, { extends: "source" });
    } catch(e) {};
}