/* Full mod by USER_404 (adapt for EcmaScript of 2023 year, fix issues) */
/* Some, common or most originals by 'anitasv' */
/* https://github.com/anitasv/zoom */

import { convertPointFromPageToNode } from "./geometry-utils.js"

//
export const scmult = (l, x) => [l * x[0], l * x[1]];
export const vcadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const minus = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
export const wedge = (a, b) => a[0] * b[1] - a[1] * b[0];
export const apply = (A, x) => vcadd(scmult(x[0], A[0]), scmult(x[1], A[1]));
export const mult = (A, B) => [apply(A, B[0]), apply(A, B[1])];

//
export class Transform {
    constructor(A, b) { this.A = A, this.b = b; }

    css() {
        const A = this.A, b = this.b;
        return `matrix(${A[0][0]||1}, ${A[0][1]||0}, ${A[1][0]||0}, ${A[1][1]||1}, 0, 0)`;
        //return `matrix(${A[0][0]||1}, ${A[0][1]||0}, ${A[1][0]||0}, ${A[1][1]||1}, ${b[0]||0}, ${b[1]||0})`;
        /*return `matrix3d(
            ${A[0][0]||1}, ${A[0][1]||0}, 0, 0, 
            ${A[1][0]||0}, ${A[1][1]||1}, 0, 0, 
            0, 0, 1, 0, 
            ${b[0]||0}, ${b[1]||0}, 0, 1
        )`;*/
    }
}

Transform.avg = (Z, I, progress) => {
    return new Transform(
        avgMatrix(Z.A, I.A, progress),
        avgVector(Z.b, I.b, progress)
    );
}

export const cascade = (T, U) => new Transform(mult(T.A, U.A), vcadd(apply(T.A, U.b), T.b));
export const rotate = (c, s) => [
    [c, s],
    [-s, c],
];
export const rotscale = (a, b) => {
    const alen = dot(a, a);
    const sig = dot(a, b);
    const del = wedge(a, b);
    return rotate(sig / alen, del / alen);
};
export const justscale = (a, b) => {
    const alen = Math.sqrt(dot(a, a));
    const blen = Math.sqrt(dot(b, b));
    const scale = blen / alen;
    return rotate(scale, 0);
};
export const magnification = (A) => Math.abs((A[0][0] + A[1][1]) / 2);
export const scaleMatrix = (A, l) => [scmult(l, A[0]), scmult(l, A[1])];
export const zoom = (s, d, allowRotation, minZoom, maxZoom, M = [Infinity, Infinity]) => {
    const a = minus(s[1], s[0]);
    const b = minus(d[1], d[0]);
    let rs = allowRotation ? rotscale(a, b) : justscale(a, b);

    const mag = magnification(rs);
    if (mag < minZoom) {
        rs = scaleMatrix(rs, minZoom / mag);
    } else if (mag > maxZoom) {
        rs = scaleMatrix(rs, maxZoom / mag);
    }

    const rs0 = apply(rs, s[0]);
    const t = minus(d[0], rs0);

    //t[0] = Math.min(Math.max(t[0], -M[0]/2), M[0]/2)||0,
    //t[1] = Math.min(Math.max(t[1], -M[1]/2), M[1]/2)||0

    return new Transform(rs, t);
};

export const avgVector = (u, v, progress) => {
    const u1 = scmult(1 - progress, u);
    const v1 = scmult(progress, v);
    return vcadd(u1, v1);
};

export const avgMatrix = (A, B, progress) => [
    avgVector(A[0], B[0], progress),
    avgVector(A[1], B[1], progress),
];
export const identity = () => new Transform([[1, 0], [0, 1]], [0, 0]);
export const defaults = (param, val) => (param === undefined ? val : param);
export const default_config = (cfg, cfg_def) => {
    const new_cfg = defaults(cfg, {});
    for (let k in cfg_def) {
        new_cfg[k] = defaults(new_cfg[k], cfg_def[k]);
    }
    return new_cfg;
};

//
Array.prototype.set = function (v) {
    const n = Math.min(this.length, v.length);
    for (let i = 0; i < n; ++i) this[i] = v[i];
    return this;
};

//
export const bounding = (offset, element)=>{
    const CB = element.getBoundingClientRect();
    const PB = element.parentNode.getBoundingClientRect();

    //
    const mnw = Math.min(CB.width  - PB.width , PB.width  - CB.width);
    const mnh = Math.min(CB.height - PB.height, PB.height - CB.height);
    const mxw = Math.max(CB.width  - PB.width , PB.width  - CB.width);
    const mxh = Math.max(CB.height - PB.height, PB.height - CB.height);

    //
    offset[0] = Math.max(Math.min(offset[0], 0), mnw);
    offset[1] = Math.max(Math.min(offset[1], 0), mnh);
}

//
export class Zoom {
    constructor(elem, config, wnd) {
        this.mayBeDoubleTap = null;
        this.isAnimationRunning = false;
        this.curTouch = 0;
        this.elem = elem;
        this.elemParent = this.elem.parentNode || this.elem?.getRootNode()?.host;
        this.activeZoom = identity();
        this.resultantZoom = identity();

        this.srcCoords = [0, 0];
        this.destCoords = [0, 0];

        this.config = default_config(config, {
            pan: false,
            rotate: true,
            minZoom: 0,
            maxZoom: Infinity,
        });

        this.wnd = wnd || window;
        this.elem.style.setProperty("will-change", "transform", "");
        this.elem.style.setProperty("transform-origin", "0% 0%", "");

        const getCoordsDouble = (t) => {
            return [
                convertPointFromPageToNode(this.elem.parentNode, t[0].pageX, t[0].pageY),
                convertPointFromPageToNode(this.elem.parentNode, t[1].pageX, t[1].pageY)
            ].map((C)=>[C.x, C.y]);
        };

        const getCoordsSingle = (t) => {
            const CX = convertPointFromPageToNode(this.elem.parentNode, t[0]?.pageX||0, t[0]?.pageY||0);
            return [CX,CX].map((C,i)=>[C.x+i,C.y+i]);
        };

        const getCoords = (t) => (t.length > 1 ? getCoordsDouble(t) : getCoordsSingle(t));
        const setSrcAndDest = (touches) => {
            this.srcCoords = getCoords(touches);
            this.destCoords = this.srcCoords;
        };

        const setDest = (touches) => {
            this.destCoords = getCoords(touches);
        };

        const handleTouchEvent = (cb) => (evt) => {
            evt.preventDefault();
            if (this.isAnimationRunning) {
                return false;
            }
            const touches = evt.touches;
            if (!touches) {
                return false;
            }
            cb(touches);
        };

        this._handleZoom = handleTouchEvent((touches) => {
            const numOfFingers = touches.length;
            if (numOfFingers !== this.curTouch) {
                this.curTouch = numOfFingers;
                this.finalize();
                if (numOfFingers !== 0) {
                    setSrcAndDest(touches);
                }
            } else {
                setDest(touches);
                this.previewZoom();
            }
        }).bind(this);

        this._handleTouchStart = handleTouchEvent((touches) => {
            if (touches.length === 1) {
                if (this.mayBeDoubleTap !== null) {
                    this.wnd.clearTimeout(this.mayBeDoubleTap);
                    this.reset(touches);
                    this.mayBeDoubleTap = null;
                } else {
                    // TODO: needs delta touch support!
                    this.mayBeDoubleTap = null;/*this.wnd.setTimeout(() => {
                        this.mayBeDoubleTap = null;
                    }, 300);*/
                }
            }
        }).bind(this);

        this.elemParent.addEventListener("touchstart", this._handleTouchStart);
        this.elemParent.addEventListener("touchstart", this._handleZoom);
        this.elemParent.addEventListener("touchmove", this._handleZoom);
        this.elemParent.addEventListener("touchend", this._handleZoom);
    }

    destroy() {
        this.elemParent.removeEventListener(
            "touchstart",
            this._handleTouchStart
        );
        this.elemParent.removeEventListener("touchstart", this._handleZoom);
        this.elemParent.removeEventListener("touchmove", this._handleZoom);
        this.elemParent.removeEventListener("touchend", this._handleZoom);
        this.elem.style.removeProperty("will-change");
        this.elem.style.removeProperty("transform-origin");
        this.elem.style.removeProperty("transform");
    }

    previewZoom() {
        const zoomLevel = magnification(this.activeZoom.A);
        const minZoom = this.config["minZoom"] / zoomLevel;
        const maxZoom = this.config["maxZoom"] / zoomLevel;
        const additionalZoom = zoom(
            this.srcCoords,
            this.destCoords,
            this.config.rotate,
            minZoom,
            maxZoom
        );
        this.resultantZoom = cascade(additionalZoom, this.activeZoom);
        this.repaint();
    }

    setZoom(newZoom) {
        this.resultantZoom = newZoom;
        this.repaint();
    }

    finalize() {
        bounding(this.resultantZoom.b, this.elem);
        this.activeZoom = this.resultantZoom;
    }

    repaint() {
        bounding(this.resultantZoom.b, this.elem);
        this.elem.style.setProperty("transform", this.resultantZoom.css(), "");
        this.elem.parentNode.scrollTo({
            left: -this.resultantZoom.b[0],
            top : -this.resultantZoom.b[1],
            behavior: "instant"
        });
    }

    reset(touches) {
        if (this.wnd.requestAnimationFrame) {
            this.isAnimationRunning = true;
            const Z = this.activeZoom;
            let startTime = null;
            const step = (time) => {
                if (!startTime) {
                    startTime = time;
                }
                const progress = (time - startTime) / 100;
                if (progress >= 1) {
                    this.setZoom(identity());
                    this.isAnimationRunning = false;
                } else {
                    this.setZoom(Transform.avg(Z, identity(), progress));
                    this.wnd.requestAnimationFrame(step);
                }
            };
            this.wnd.requestAnimationFrame(step);
        } else {
            this.setZoom(identity());
        }
    }
}
