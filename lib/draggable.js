import { convertPointFromPageToNode } from "./geometry-utils.js"
import { _loader_, exchange, promiseAnimationFrame, promiseDomContentLoaded } from "./utils.js"

//
export let Draggable = {};

//
try {

    class Axis {
        constructor(size, applicant) {
            this.size = size;
            this.last = 0;
            this.shift = 0;
            this.applicant = ()=>applicant(this.shift);
            this.pointerId = -1;
        }
    }

    customElements.define("drag-able", Draggable = class Draggable extends HTMLElement {
        constructor() {
            super();

            //
            this._style = document.createElement("style");

            //
            (async()=>{
                this._style.textContent = await _loader_("./draggable.css");
                this.classList.add("drag-able");
                requestAnimationFrame(()=>{
                    this._loadFromStorage();
                });
            })();

            //
            this._handle = document.createElement("slot");
            this._handle.classList?.add("handle");
            this._handle.setAttribute("name", "handle");

            //
            this._content = document.createElement("slot");
            this._content.classList?.add("content");
            this._content.setAttribute("name", "content");

            //
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(this._handle);
            this.shadowRoot.appendChild(this._content);
            this.shadowRoot.appendChild(this._style);

            //
            window.addEventListener("beforeunload", this._saveToStorage.bind(this));
            window.addEventListener("unload", this._saveToStorage.bind(this));

            //
            this.axis = [
                new Axis(()=>this.offsetWidth,  (shift)=> this.style.setProperty("--x", shift + "px")),
                new Axis(()=>this.offsetHeight, (shift)=> this.style.setProperty("--y", shift + "px"))
            ];
            

            {
                this._handle.parentNode.addEventListener("pointerdown", (e)=> {
                    this.focus();
                    e.preventDefault();
                    const offset = convertPointFromPageToNode(this.parentNode || this.getRootNode().host, e.pageX, e.pageY);
                    this.axis.map((a, i)=>{ a.pointerId = e.pointerId; a["last"] = offset[["x","y"][i]]; a.applicant(); });
                });
                
                //
                document.addEventListener("pointermove", (e)=> {
                    if (this.axis.find((a)=>(a.pointerId == e.pointerId))) { 
                        e.preventDefault();
                        const offset = convertPointFromPageToNode(this.parentNode || this.getRootNode().host, e.pageX, e.pageY);
                        this.axis.map((a, i)=>{
                            if (a.pointerId == e.pointerId) {
                                const _axis_ = offset[["x","y"][i]]||0;
                                a.shift += (_axis_ - (exchange(a, "last", _axis_)||0))||0;
                                // TODO: limit 'shift', of corrections
                                a.applicant();
                            }
                        });
                    };
                });

                //
                document.addEventListener("pointerup", (e)=> {
                    if (this.axis.find((a)=>(a.pointerId == e.pointerId))) { e.preventDefault();
                        //const offset = convertPointFromPageToNode(this.parentNode || this.getRootNode().host, e.pageX, e.pageY);
                        this.axis.map((a, i)=>{
                            if (a.pointerId == e.pointerId) { a.pointerId = -1; a.applicant(); };
                        });
                    };
                });
            }

            //
            Promise.any([promiseDomContentLoaded(), promiseAnimationFrame()]).then(()=>{
                this._loadFromStorage();
            });

            //
            this._loadFromStorage();

            //
            return this;
        }

        _saveToStorage() {
            if (this.hasAttribute("storage")) {
                if (!isNaN(this.axis[0].shift)) { localStorage.setItem(this.getAttribute("storage") + "-x", this.axis[0].shift); };
                if (!isNaN(this.axis[1].shift)) { localStorage.setItem(this.getAttribute("storage") + "-y", this.axis[1].shift); };
            }
            return this;
        }

        _loadFromStorage() {
            if (this.hasAttribute("storage")) {
                //this.axis[0].shift = parseFloat(localStorage.getItem(this.getAttribute("storage") + "-x"))||0;
                //this.axis[1].shift = parseFloat(localStorage.getItem(this.getAttribute("storage") + "-y"))||0;
                this.axis.map((e)=>e.applicant());
            }
            return this;
        }

        disconnectedCallback() {
            
        }

        connectedCallback() {
            return Promise.any([promiseDomContentLoaded(), promiseAnimationFrame()]).then(()=>{
                this._loadFromStorage(); 
            });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            
        }

        static get observedAttributes() {
            return [];
        }
    });
} catch(e) {};
