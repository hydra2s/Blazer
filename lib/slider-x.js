
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
            const E = this._scrollable;
            E.addEventListener("wheel", (e)=>{
                e.preventDefault();

                // abuse a scrolling bug?
                if (e.deltaY > 0) { E.scrollBy( 10, 0); };
                if (e.deltaY < 0) { E.scrollBy(-10, 0); };
            });

            //
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(this._scrollable);
            this._scrollable.appendChild(this._slot);
            this.shadowRoot.appendChild(this._style);

            this._style.textContent = `
            /* TODO: scrolling library! */
            :host {
                min-width: min-content;
                min-height: min-content;

                /* */
                width: min-content;
                height: min-content;

                /* */
                max-width: min(min(100cqw, 100vw), 100%);
                max-height: min(min(100cqh, 100vh), 100%);

                /* */
                display: inline-block;
                position: relative;
                overflow: hidden;
                
                /* */
                padding: 0px;
                margin: 0px;
            }

            :host > .scrollable {
                min-width: min-content;
                min-height: min-content;

                /* */
                max-width: min(min(100cqw, 100vw), 100%);
                max-height: min(min(100cqh, 100vh), 100%);

                /* */
                width: min(min(100cqw, 100vw), 100%);
                height: min(min(100cqh, 100vh), 100%);

                /* */
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

            :host > .scrollable > ::slotted(*) {
                flex: 0 0 100%;
                aspect-ratio: 16 / 9;

                /* */
                min-width: min-content;
                min-height: min-content;

                /* */
                max-width: min(min(100cqw, 100vw), 100%);
                max-height: min(min(100cqh, 100vh), 100%);

                /* */
                width: min(min(100cqw, 100vw), 100%);
                height: min(min(100cqh, 100vh), 100%);

                /* */
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
