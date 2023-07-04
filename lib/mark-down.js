//
import { InterWork } from "./intercom.js"
import DOMPurify from '../deps/purify.es.js';
import * as marked from "../deps/marked.esm.js";

// 
export let MarkDown = {};
if (!(typeof self != "undefined" && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)) {

    // TODO: new Image class
    try {
        customElements.define("mark-down", MarkDown = class MarkDown extends HTMLElement {
            constructor() {
                super();

                //
                this._slot = document.createElement("slot");
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(this._slot);
                this.classList.add("text");

                //
                this.innerHTML = DOMPurify.sanitize(marked.parse(this.innerHTML));
                (this._observer = new MutationObserver(mutations => {
                    // block scripts instantly!
                    (this._observer.unobserve||this._observer.disconnect).call(this._observer,this);
                    this.innerHTML = DOMPurify.sanitize(marked.parse(this.innerHTML));
                    this._observer.observe(this, {
                        childList: true,
                        subtree: true
                    });
                })).observe(this, {
                    childList: true,
                    subtree: true
                })
            }

            disconnectedCallback() {
                (this._observer.unobserve||this._observer.disconnect).call(this._observer,this);
            }

            connectedCallback() {
                (this._observer.unobserve||this._observer.disconnect).call(this._observer,this);
                this.innerHTML = DOMPurify.sanitize(marked.parse(this.innerHTML));
                this._observer.observe(this, {
                    childList: true,
                    subtree: true
                });
            }

            async attributeChangedCallback(name, oldValue, newValue) {
                if (name == "src" && newValue && oldValue != newValue) {
                    (this._observer.unobserve||this._observer.disconnect).call(this._observer,this);
                    this.innerHTML = DOMPurify.sanitize(marked.parse(await (await fetch(newValue)).text()));
                }
            }

            static get observedAttributes() {
                return ["src"];
            }
        });
    } catch(e) {};

}
