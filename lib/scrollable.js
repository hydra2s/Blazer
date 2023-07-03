import { Zoom } from "./zoom-mod.js"
import { convertPointFromPageToNode } from "./geometry-utils.js"

//
export let Scrollable = {};

//
try {
        
    if (typeof window != "undefined" && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
    }

    customElements.define("scroll-able", Scrollable = class Scrollable extends HTMLElement {
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
            this._content = document.createElement("div");

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
            this._content.classList.add("content");

            //
            this.attachShadow({ mode: "open" });

            //
            this._points.forEach((E)=>this.shadowRoot.appendChild(E));
            this.shadowRoot.appendChild(this._scrollX);
            this.shadowRoot.appendChild(this._scrollY);
            this.shadowRoot.appendChild(this._scrollable);
            this._scrollX.appendChild(this._trackX);
            this._scrollY.appendChild(this._trackY);
            this.shadowRoot.appendChild(this._style);

            //
            //this.shadowRoot.style.display = "contents";

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
                this._trackX.addEventListener("selectstart", (e)=> { e.preventDefault(); return false; }, true);

                this._sX = 0;
                this._scrollingX = -1;
                this._trackX.parentNode.addEventListener("pointerdown", (e)=> {
                    if (!document.body.classList.contains("dragging")) {
                        document.body.classList.add("dragging");
                    }
                    this._scrollingX = e.pointerId;
                    this._sX = convertPointFromPageToNode(this._trackX.parentNode, e.pageX, e.pageY).x //e.offsetX;
                    this._updateSize()._updateScroll();
                }, true);
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
                    this._sY = convertPointFromPageToNode(this._trackY.parentNode, e.pageX, e.pageY).y; //e.offsetY;
                    this._updateSize()._updateScroll();
                }, true);
            }

            {
                document.addEventListener("pointermove", (e)=> {
                    this._updateSize();
                    const bounding = (this._scrollingX == e.pointerId || this._scrollingY == e.pointerId) ? this._content.getBoundingClientRect() : null;
                    if (this._scrollingX == e.pointerId) {
                        const offsetX = convertPointFromPageToNode(this._trackX.parentNode, e.pageX, e.pageY).x;
                        
                        this._spcX += (offsetX - this._sX) / (this._trackX.parentNode.offsetWidth - this._trackX.offsetWidth); this._sX = offsetX;
                        this._trackX.style.setProperty("--offsetPercent", this._spcX = Math.min(Math.max(this._spcX, 0.0), 1.0), "");
                        this._scrollable.focus();
                        this._scrollable.scrollTo({
                            left: this._spcX * (bounding.width - this._scrollable.offsetWidth),
                            behavior: "instant"
                        });
                        
                    }
                    if (this._scrollingY == e.pointerId) {
                        const offsetY = convertPointFromPageToNode(this._trackY.parentNode, e.pageX, e.pageY).y;

                        this._spcY += (offsetY - this._sY) / (this._trackY.parentNode.offsetHeight - this._trackY.offsetHeight); this._sY = offsetY;
                        this._trackY.style.setProperty("--offsetPercent", this._spcY = Math.min(Math.max(this._spcY, 0.0), 1.0), "");
                        this._scrollable.focus();
                        this._scrollable.scrollTo({
                            top: this._spcY * (bounding.height - this._scrollable.offsetHeight),
                            behavior: "instant"
                        });
                    }
                    this._updateScroll();
                }, true);

                //
                document.addEventListener("pointerup", (e)=> {
                    if (this._scrollingY == e.pointerId || this._scrollingX == e.pointerId) { document.body.classList.remove("dragging"); };
                    if (this._scrollingY == e.pointerId) { this._scrollingY = -1; }
                    if (this._scrollingX == e.pointerId) { this._scrollingX = -1; }
                }, true);
            }

            //
            {   
                this._scrollable.appendChild(this._content);
                this._content.appendChild(this._slot);
                this._zoom = new Zoom(this._content, {
                    minZoom: 1,
                    maxZoom: 10,
                    rotate: false,
                    pan: false
                });
            }

            //
            this._style.textContent = `
            /* TODO: scrolling library! */
            :host {
                /* don't override! */
                position: relative !important;
                top: 0; bottom: 0; left: 0; right: 0;
                display: inline-block;
                overflow: hidden;
                touch-action: none;

                /* */
                max-width: min(min(100cqw, 100vw), 100%);
                max-height: min(min(100cqh, 100vh), 100%);

                /* */
                width: min(min(100cqw, 100vw), 100%);
                height: min(min(100cqh, 100vh), 100%);

                /* */
                min-width: min-content;
                min-height: min-content;

                /* */
                padding: 0px;
                margin: 0px;

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
            :host > .top-left, 
            :host > .top-right, 
            :host > .bottom-left, 
            :host > .bottom-right 
            {
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

            :host > .top-right {
                top: calc(0px - var(--padding-top));
                left: auto;
                bottom: auto;
                right: calc(0px - var(--padding-right));
                float: right;
            }

            :host > .top-left {
                top: calc(0px - var(--padding-top));
                left: calc(0px - var(--padding-left));
                bottom: auto;
                right: auto;
                float: left;
            }

            :host > .bottom-right {
                top: auto;
                left: auto;
                bottom: calc(0px - var(--padding-bottom));
                right: calc(0px - var(--padding-right));
                float: right;
            }

            :host > .bottom-left {
                top: auto;
                left: calc(0px - var(--padding-left));
                bottom: calc(0px - var(--padding-bottom));
                right: auto;
                float: left;
            }

            :host > .scrollable > .content {
                display: inline-block;
                position: relative !important;
                /*position: sticky;*/ /* Badly works... */
                top: 0; left: 0; right: 0; bottom: 0;
                min-width: min-content;
                min-height: min-content;
                overflow: visible;
            }

            :host > .scrollable {
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
                z-index: 0;
                text-align: center;
                position: relative;
                top: 0; left: 0; right: 0; bottom: 0;

                /* */
                display: flex;
                align-items: center;
                justify-content: center;

                /* */
                width: min(min(100cqw, 100vw), 100%);
                height: min(min(100cqh, 100vh), 100%);

                /* */
                max-width: min(min(100cqw, 100vw), 100%);
                max-height: min(min(100cqh, 100vh), 100%);

                /* */
                overflow: scroll !important;
                overflow: overlay !important;
                
                /* */
                scrollbar-gutter: stable both-edges;
                scrollbar-width: thin;
                scrollbar-width: none;
                scroll-behavior: smooth;
                touch-action: none;
            }

            /* */
            :host > .scroll-y {
                height: calc(100cqh - min(1vh, 1vw));
                width: min(1vh, 1vw);

                top: 0px;
                right: 0px;
                left: auto;
            }
            
            /* */
            :host > .scroll-x {
                width: calc(100cqw - min(1vh, 1vw));
                height: min(1vh, 1vw);
                
                left: 0px;
                bottom: 0px;
                top: auto;
            }

            /* */
            :host > .scroll-x, 
            :host > .scroll-y 
            {
                overflow: hidden;
                position: absolute;
                background-color: transparent;
                pointer-events: none;
                z-index: 9999;
            }
            

            
            :host > .scroll-y > .track {
                --offsetPercent: 0.0;

                width: cqw;
                height: var(--ownSize);
                transform: translateY(
                    calc(
                        var(--offsetPercent) * 
                        calc(100cqh - var(--ownSize))
                    )
                );
            }

            :host > .scroll-x > .track {
                --offsetPercent: 0.0;

                height: cqh;
                width: var(--ownSize);
                transform: translateX(
                    calc(
                        var(--offsetPercent) * 
                        calc(100cqw - var(--ownSize))
                    )
                );
            }

            /* */
            :host > .scroll-x > .track, 
            :host > .scroll-y > .track 
            {
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

            :host > .scroll-x > .track:active, 
            :host > .scroll-y > .track:active 
            {
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
                
                const bounding = this._content.getBoundingClientRect();
                this._scrollable.focus();
                this._scrollable.scrollTo({
                    left: this._spcX * (bounding.width - this._scrollable.offsetWidth),
                    top: this._spcY * (bounding.height - this._scrollable.offsetHeight),
                    behavior: "instant"
                });
            }
            return this;
        }

        _updateScroll() {
            const bounding = this._content.getBoundingClientRect();
            if (this._scrollingY < 0) { this._trackY.style.setProperty("--offsetPercent", this._spcY = (this._scrollable.scrollTop / (bounding.height - this._scrollable.offsetHeight)), ""); };
            if (this._scrollingX < 0) { this._trackX.style.setProperty("--offsetPercent", this._spcX = (this._scrollable.scrollLeft / (bounding.width - this._scrollable.offsetWidth)), ""); };
            return this;
        
        }

        _updateSize() {
            const tX = this._trackX;
            const tY = this._trackY;
            const bounding = this._content.getBoundingClientRect();

            tX.style.setProperty("--ownSize", (tX.parentNode.offsetWidth * (this._scrollCoefX = this._scrollable.offsetWidth / bounding.width)) + "px", "");
            tX.style.setProperty("--parentSize", tX.parentNode.offsetWidth + "px", "");

            tY.style.setProperty("--ownSize", (tY.parentNode.offsetHeight * (this._scrollCoefY = this._scrollable.offsetHeight / bounding.height)) + "px", "");
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
