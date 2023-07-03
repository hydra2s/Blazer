import { Zoom } from "./zoom-mod.js"
import { convertPointFromPageToNode } from "./geometry-utils.js"

//
export let Scrollable = {};

//
try {
        
    if (typeof window != "undefined" && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
    }

    class ScrollBar {
        constructor({className, axisName, sizeCoef, diffOfBox, applicant}) {
            this.element = document.createElement("div");
            this.element.classList.add(className);
            this.track = document.createElement("div");
            this.track.classList.add("track");
            this.element.appendChild(this.track);
            this.pointerId = -1;

            //
            this._last = 0;
            this._shift = 0;
            this._percent = 0;

            //
            this._sizeCoef = sizeCoef;
            this._applicant = applicant;
            this._axisName = axisName;
            this._diffOfBox = diffOfBox;
            this._ownSize = ()=>(this.track[["offsetWidth", "offsetHeight"][this._axisName]]);
            this._parentSize = ()=>(this.element[["offsetWidth", "offsetHeight"][this._axisName]]);

            //
            this.element.addEventListener("pointerdown", (e)=>{
                e.preventDefault();
                this.pointerId = e.pointerId;
                this.element.focus();
                this.last = convertPointFromPageToNode(this.element, e.pageX, e.pageY)[["x","y"][this._axisName]];

                if (!document.body.classList.contains("dragging")) {
                    document.body.classList.add("dragging");
                }
            });

            //
            document.addEventListener("pointermove", (e)=>{
                if (e.pointerId == this.pointerId) {
                    e.preventDefault();
                    const offset = convertPointFromPageToNode(this.element, e.pageX, e.pageY);
                    this.shift = (this.shift + (offset[["x","y"][this._axisName]] - this.last)); this.last = offset[["x","y"][this._axisName]];
                };
                this.shift; this.percent;
            });

            //
            document.addEventListener("pointerup", (e)=>{
                if (e.pointerId == this.pointerId) {
                    e.preventDefault();
                    this.pointerId = -1;
                    document.body.classList.remove("dragging");
                };
            });
        }

        get diffOfBox() {
            if (this._sizeCoef() > 0.999) {
                this.element.style.setProperty("pointer-events", "none", "");
                this.element.style.setProperty("opacity", "0.0", "");
            } else {
                this.element.style.removeProperty("pointer-events");
                this.element.style.removeProperty("opacity");
            }
            return this._diffOfBox();
        }

        set shift(a) {
            this._percent = (this._shift = a) / this.diffSize;
            this.percent;
        }

        set offset(a) {
            this._percent = a / this.diffOfBox;
        }

        get offset() {
            return (this._percent * this.diffOfBox);
        }

        get shift() {
            return (this._shift = this._percent * this.diffSize);
        }

        set percent(a) {
            this.track.style.setProperty("--offsetPercent", this._percent = Math.min(Math.max(a, 0.0), 1.0));
            this._applicant(this._percent, this.diffOfBox);
        }

        get percent() {
            const _percent_ = Math.min(Math.max(this.shift / this.diffSize, 0.0), 1.0);
            this.track.style.setProperty("--offsetPercent", _percent_);
            this._applicant(_percent_, this.diffOfBox);
            return (this._percent = _percent_);
        }

        get diffSize() { return this.parentSize - this.ownSize; }
        get ownSize() {
            const _ownSize_ = /*this._ownSize() ||*/ (this._sizeCoef() * this.parentSize);
            this.track.style.setProperty("--ownSize", _ownSize_ + "px");
            return _ownSize_;
        };
        get parentSize() {
            const _parentSize_ = this._parentSize();
            this.track.style.setProperty("--parentSize", _parentSize_ + "px");
            return _parentSize_;
        };
        
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
            this._scroll = [
                new ScrollBar({
                    className: "scroll-x", axisName: 0, 
                    sizeCoef: ()=>(this._scrollable.offsetWidth / this._content.getBoundingClientRect().width ), 
                    diffOfBox: ()=>(this._content.getBoundingClientRect().width - this._scrollable.offsetWidth), 
                    applicant: (percent, diffOfBox)=>(this._scrollable.scrollTo({ left: percent * diffOfBox, behavior: "instant" }))
                }),
                new ScrollBar({
                    className: "scroll-y", axisName: 1, 
                    sizeCoef: ()=>(this._scrollable.offsetHeight / this._content.getBoundingClientRect().height), 
                    diffOfBox: ()=>(this._content.getBoundingClientRect().height - this._scrollable.offsetHeight), 
                    applicant: (percent, diffOfBox)=>(this._scrollable.scrollTo({ top : percent * diffOfBox, behavior: "instant" }))
                })
            ]

            //
            this._scrollable = document.createElement("div");
            this._scrollable.classList.add("scrollable");

            //
            this._content = document.createElement("div");
            this._content.classList.add("content");

            //
            this._slot = document.createElement("slot");
            this._style = document.createElement("style");

            //
            window.addEventListener("beforeunload", this._saveToStorage.bind(this));
            window.addEventListener("resize", ()=> { this._updateSize()._updateScroll(); });
            document.addEventListener("resize", ()=> { this._updateSize()._updateScroll(); });
            this.addEventListener("resize", ()=> { this._updateSize()._updateScroll(); });
            this._scrollable.addEventListener("resize", ()=> { this._updateSize()._updateScroll() });
            this._scrollable.addEventListener("scroll", ()=> { this._updateSize()._updateScroll() });

            //
            this.attachShadow({ mode: "open" });
            this._points.forEach((E)=>this.shadowRoot.appendChild(E));
            
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
                this._scrollable.appendChild(this._content);
                this._content.appendChild(this._slot);
                this.shadowRoot.appendChild(this._scroll[0].element);
                this.shadowRoot.appendChild(this._scroll[1].element);
                this.shadowRoot.appendChild(this._scrollable);
                this.shadowRoot.appendChild(this._style);
            }

            //
            if (!this.hasAttribute("pinch-and-zoom") || this.getAttribute("pinch-and-zoom")) {
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
                overflow: hidden !important;
                touch-action: none;
                scrollbar-width: none !important;

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
                -webkit-font-smoothing: subpixel-antialiased;
                -moz-osx-font-smoothing: auto;
                font-smooth: always;
                text-rendering: optimizeLegibility;
                text-rendering: geometricPrecision;

                /* */
                /*-webkit-backface-visibility: hidden;
                -moz-backface-visibility: hidden;
                -ms-backface-visibility: hidden;
                backface-visibility: hidden;*/

                /* */
                /*-webkit-perspective: 1000;
                -moz-perspective: 1000;
                -ms-perspective: 1000;
                perspective: 1000;*/
            
                /* Enable hardware acceleration */
                /*-webkit-transform: translate3d(0, 0, 0);
                -moz-transform: translate3d(0, 0, 0);
                -ms-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);*/

                /* */
                transform-origin: 50% 50%;
            
                /* Some filter hack */
                /*filter: grayscale(0%);*/
                overflow: hidden;
                scrollbar-width: none;
                box-sizing: border-box;

                /* Disable transition by default */
                -webkit-transition: none;
                -moz-transition: none;
                -o-transition: none;
                transition: none;
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
                box-sizing: border-box;
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
                box-sizing: border-box;
            }

            /* work-around for chrome */
            :host > .scrollable::-webkit-scrollbar {
                -webkit-appearance: none;
                display: none;
                width: 0;
                height: 0;
                opacity: 0;
                pointer-events: none;
                visibility: hidden;
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
                padding: 0;
                margin: 0;
                box-sizing: border-box;

                /* */
                display: block;

                /* */
                width: min(min(100cqw, 100vw), 100%);
                height: min(min(100cqh, 100vh), 100%);

                /* */
                max-width: min(min(100cqw, 100vw), 100%);
                max-height: min(min(100cqh, 100vh), 100%);
                
                /* */
                overflow: auto !important;
                scrollbar-gutter: stable both-edges;
                scrollbar-width: none;
                scroll-behavior: smooth;
                touch-action: none;
            }

            /* */
            :host > .scroll-x, 
            :host > .scroll-y 
            {
                box-sizing: border-box;
                overflow: hidden;
                position: absolute;
                background-color: transparent;
                pointer-events: none;
                z-index: 9999;
            }

            /* */
            :host > .scroll-x > .track, 
            :host > .scroll-y > .track 
            {
                /* for touch screen */
                /*position: sticky; */

                /* */
                box-sizing: border-box;
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


            /* */
            :host > .scroll-y {
                height: calc(min(100cqh, 100%) - min(1vh, 1vw));
                width: min(1vh, 1vw);

                top: 0px;
                right: 0px;
                left: auto;
            }
            
            /* */
            :host > .scroll-x {
                width: calc(min(100cqw, 100%) - min(1vh, 1vw));
                height: min(1vh, 1vw);
                
                left: 0px;
                bottom: 0px;
                top: auto;
            }

            :host > .scroll-y > .track {
                --offsetPercent: 0.0;

                width: min(100cqw, 100%);
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

                height: min(100cqh, 100%);
                width: var(--ownSize);
                transform: translateX(
                    calc(
                        var(--offsetPercent) * 
                        calc(100cqw - var(--ownSize))
                    )
                );
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
                localStorage.setItem(this.getAttribute("storage") + "-spX", this._scroll[0].percent);
                localStorage.setItem(this.getAttribute("storage") + "-spY", this._scroll[1].percent);
            }
            return this;
        }

        _loadFromStorage() {
            if (this.hasAttribute("storage")) {
                this._scroll[0].percent = parseFloat(localStorage.getItem(this.getAttribute("storage") + "-spX"))||0;
                this._scroll[1].percent = parseFloat(localStorage.getItem(this.getAttribute("storage") + "-spY"))||0;
            }
            return this;
        }

        _updateScroll() {
            this._scroll.map((e,i)=>(e.percent = this._scrollable[["scrollLeft", "scrollTop"][i]] / e.diffOfBox));
            return this;
        }

        _updateSize() {
            this._scroll.map((e)=>{ e.parentSize; e.ownSize; });
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
