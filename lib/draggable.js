import { convertPointFromPageToNode } from "./geometry-utils.js"

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
                    this.axis.map((a, i)=>{ a.pointerId = e.pointerId; a.last = offset[["x","y"][i]]; a.applicant(); });
                });
                
                //
                document.addEventListener("pointermove", (e)=> {
                    if (this.axis.find((a)=>(a.pointerId == e.pointerId))) { 
                        e.preventDefault();
                        const offset = convertPointFromPageToNode(this.parentNode || this.getRootNode().host, e.pageX, e.pageY);
                        this.axis.map((a, i)=>{
                            if (a.pointerId == e.pointerId) {
                                a.shift += ((offset[["x","y"][i]]||0) - (a.last||0)) || 0; 
                                a.last = offset[["x","y"][i]]||0;
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
            this._style.textContent = `
            :host {
                --x: 0px; --y: 0px;
                position: relative;
                will-change: transform;
                transform: translate3d(var(--x), var(--y), 0) !important;
                transform-origin: 50% 50%;
                top: 0; left: 0; right: 0; bottom: 0;
                overflow: hidden;
                display: inline-block;
            }

            :host > .handle {
                position: relative;
                top: 0; left: 0; right: 0; bottom: 0;
                touch-action: none !important;
                display: inline-block;
                cursor: grab;
            }

            :host > .handle:active {
                cursor: grabbing;
            }

            .host > .content {
                position: relative;
                top: 0; left: 0; right: 0; bottom: 0;
                display: inline-block;
            }
`;

            //
            requestAnimationFrame(()=>{ this._loadFromStorage(); });
            document.addEventListener("DOMContentLoaded", ()=>{ this._loadFromStorage(); });

            //
            return this;
        }

        _saveToStorage() {
            if (this.hasAttribute("storage")) {
                localStorage.setItem(this.getAttribute("storage") + "-x", this.axis[0].shift);
                localStorage.setItem(this.getAttribute("storage") + "-y", this.axis[1].shift);
            }
            return this;
        }

        _loadFromStorage() {
            if (this.hasAttribute("storage")) {
                this.axis[0].shift = parseFloat(localStorage.getItem(this.getAttribute("storage") + "-x"))||0;
                this.axis[1].shift = parseFloat(localStorage.getItem(this.getAttribute("storage") + "-y"))||0;
                this.axis.map((e)=>e.applicant());
            }
            return this;
        }

        disconnectedCallback() {
            
        }

        connectedCallback() {
            requestAnimationFrame(()=>{ this._loadFromStorage(); });
            document.addEventListener("DOMContentLoaded", ()=>{ this._loadFromStorage(); });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            
        }

        static get observedAttributes() {
            return [];
        }
    });
} catch(e) {};
