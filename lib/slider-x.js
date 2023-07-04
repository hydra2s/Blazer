import { _loader_ } from "./utils.js"

export let SliderX = {};

//
try {
    customElements.define("slider-x", SliderX = class SliderX extends HTMLElement {
        constructor() {
            super();

            //
            this._scrollable = document.createElement("div");
            this._slot = document.createElement("slot");
            this._style = document.createElement("style");
            this._scrollable.classList.add("scrollable");

            //
            (async()=>{
                this._style.textContent = await _loader_("./slider-x.css");
            })();

            //
            const E = this._scrollable;
            E.addEventListener("wheel", (e)=>{
                e.preventDefault();

                // abuse a scrolling bug?
                if (e.deltaY > 0) { E.scrollBy( 10, 0); };
                if (e.deltaY < 0) { E.scrollBy(-10, 0); };
            });

            //
            //E.addEventListener("touchstart", (e)=> { e.preventDefault(); });
            //E.addEventListener("touchmove", (e)=> { e.preventDefault(); });
            //E.addEventListener("touchend", (e)=> { e.preventDefault(); });

            //
            this.attachShadow({ mode: "open" });
            this._scrollable.appendChild(this._slot);
            this.shadowRoot.appendChild(this._scrollable);
            this.shadowRoot.appendChild(this._style);

            

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
