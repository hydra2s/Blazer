import { Zoom } from "./zoom-mod.js"
import { convertPointFromPageToNode } from "./geometry-utils.js"
import { _loader_, exchange, promiseAnimationFrame, promiseDomContentLoaded } from "./utils.js"

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
                    const _axis_ = offset[["x","y"][this._axisName]]||0;
                    this.shift = (this.shift + (_axis_ - exchange(this, "last", _axis_)));
                } else {
                    this.shift;
                }
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

        get shift() {
            const _shift_ = this._shift;
            const _percent_ = (this._percent = Math.min(Math.max(_shift_ / Math.max(this.diffSize, 0.0001), 0.0), 1.0));
            this.track.style.setProperty("--offsetPercent", _percent_);
            this._applicant(_percent_, this.diffOfBox);
            return _shift_;
        }

        get percent() {
            const _percent_ = Math.min(Math.max(this._percent, 0.0), 1.0);//(this._percent = Math.min(Math.max(this._shift / this.diffSize, 0.0), 1.0));
            const _shift = (this._shift = _percent_ * this.diffSize);
            this.track.style.setProperty("--offsetPercent", _percent_);
            this._applicant(_percent_, this.diffOfBox);
            return _percent_;
        }

        set shift(a) {
            const _percent_ = (this._percent = Math.min(Math.max((this._shift = a) / Math.max(this.diffSize, 0.0001), 0.0), 1.0));
            this.track.style.setProperty("--offsetPercent", _percent_);
            this._applicant(_percent_, this.diffOfBox);
        }

        set percent(a) {
            const _percent_ = (this._percent = Math.min(Math.max(a, 0.0), 1.0));
            const _shift_ = (this._shift = _percent_ * this.diffSize);
            this.track.style.setProperty("--offsetPercent", _percent_);
            this._applicant(_percent_, this.diffOfBox);
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
            ];

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
            (async()=>{
                this._style.textContent = await _loader_("./scrollable.css");
                this.classList.add("scroll-able");
                Promise.any([promiseDomContentLoaded(), promiseAnimationFrame()]).then(()=>{
                    this._updateSize()._loadFromStorage();
                });
            })();

            //
            window.addEventListener("load", this._saveToStorage.bind(this));
            window.addEventListener("unload", this._saveToStorage.bind(this));
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
            Promise.any([promiseDomContentLoaded(), promiseAnimationFrame()]).then(()=>{
                this._updateSize()._loadFromStorage();
            });

            //
            this._loadFromStorage();

            //
            return this;
        }

        _saveToStorage() {
            if (this.hasAttribute("storage")) {
                if (!isNaN(this._scroll[0].percent)) { localStorage.setItem(this.getAttribute("storage") + "-spX", this._scroll[0].percent); };
                if (!isNaN(this._scroll[1].percent)) { localStorage.setItem(this.getAttribute("storage") + "-spY", this._scroll[1].percent); };
            }
            return this;
        }

        _loadFromStorage() {
            if (this.hasAttribute("storage")) {
                this._scroll[0].percent = parseFloat(localStorage.getItem(this.getAttribute("storage") + "-spX"))||0;
                this._scroll[1].percent = parseFloat(localStorage.getItem(this.getAttribute("storage") + "-spY"))||0;
            } else {
                this._updateScroll();
            }
            return this;
        }

        _updateScroll() {
            this._scroll.map((e,i)=>(e.percent = this._scrollable[["scrollLeft", "scrollTop"][i]] / Math.max(e.diffOfBox, 0.0001)));
            return this;
        }

        _updateSize() {
            this._scroll.map((e)=>{ e.parentSize; e.ownSize; });
            return this;
        }

        disconnectedCallback() {
            
        }

        connectedCallback() {
            return Promise.any([promiseDomContentLoaded(), promiseAnimationFrame()]).then(()=>{
                this._updateSize()._loadFromStorage();
            });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            
        }

        static get observedAttributes() {
            return [];
        }
    });
} catch(e) {};
