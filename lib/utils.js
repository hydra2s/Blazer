//
import { Float16Array, isFloat16Array, isTypedArray, getFloat16, setFloat16, f16round } from "../float16/browser/float16.mjs";

//
const swap32 = (val) => {
    return ((val & 0xFF) << 24)
           | ((val & 0xFF00) << 8)
           | ((val >> 8) & 0xFF00)
           | ((val >> 24) & 0xFF);
}

//
const exchange = (obj, key, _new_)=> { const _old_ = obj[key]; obj[key] = _new_; return _old_; };

//
Object.exchange = exchange;
Array.exchange = exchange;

//
Array.prototype.exchange = function(I, _new_) { return exchange(this, I, _new_); };

//
const createDOMCanvas = (W,H) => {
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        return new Promise((R,E)=>{
            const id = uuidv4();
            const single = (ev) => { if (ev.data.id == id) { self.removeEventListener('message', single); R(ev.data.offscreen); }; };
            self.addEventListener('message', single);
            // if are blob, make as URL
            //if (url instanceof Blob) { url = URL.createObjectURL(url); };
            self.postMessage({ id, offscreen: "request", W,H });
        });
    }

    var canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    return canvas;
}

//
const loadImageBitmap = async (bitmap, createFunc = createDOMCanvas, showFunc = (C,B)=>{
    C.getContextDeepSpace("2d", { 
        desynchronized: true, 
        willReadFrequently: true
    }).drawImage(B, 0, 0);
}, getFunc = (C)=>C) => {
    const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
    var bitmap = await bitmap;
    var canvas = await createFunc(bitmap.width, bitmap.height, bitmap);//(offscreen || isWorker) ? new OffscreenCanvas(bitmap.width, bitmap.height) : createDOMCanvas(bitmap.width, bitmap.height);
    showFunc(canvas, bitmap);
    return await getFunc(canvas);
}

//
const loadImage = async (url) => {
    let image = new Image();
    image.decoding = "async";
    image.fetchPriority = "high";
    image.loading = "eager";
    image.async = true;
    image.crossOrigin = "anonymous";

    // don't doubt about that
    let $url = await url; image.src = ($url instanceof Blob) ? URL.createObjectURL($url) : $url;
    await image.decode();

    // FOR DEBUG!
    /*
    image.width = 160;
    image.height = 120;
    image.alt = "Problematic";
    document.body.appendChild(image);
    */

    //
    return image;
}

//
const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

//
const loadBitmapThroughput = async (url) => {
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        return new Promise((R,E)=>{
            const id = uuidv4();
            const single = (ev) => { if (ev.data.id == id) { self.removeEventListener('message', single); R(ev.data.svg); }; };
            self.addEventListener('message', single); let T = [];
            if (url instanceof ArrayBuffer || (typeof SharedArrayBuffer != "undefined" ? url instanceof SharedArrayBuffer : false)) 
                { T.push([url]); }
            // if are blob, make as URL
            //if (url instanceof Blob) { url = URL.createObjectURL(url); };
            self.postMessage({ id, svg: "request", url }, ...T);
        });
    } else {
        return createImageBitmap(await loadImage(url), {
            colorSpaceConversion: "none",
            resizeQuality: "pixelated"
        });
    }
}

// needs interface for worker
const provideForWorker = (worker) => {
    worker.addEventListener('message', async (ev) => {
        if (ev.data.url) {
            let bitmap = await createImageBitmap(await loadImage(ev.data.url), {
                colorSpaceConversion: "none",
                resizeQuality: "pixelated"
            });
            worker.postMessage({id: ev.data.id, svg: bitmap}, [bitmap]);
        }
        if (ev.data.W && ev.data.H) {
            let shared = createDOMCanvas(ev.data.W, ev.data.H);
            let offscreen = shared.transferControlToOffscreen();
            worker.postMessage({id: ev.data.id, offscreen}, [offscreen]);
        }
    });
    return worker;
}


//
const createSRGBAlphaBitmap = async function(_bitmap_){
    const _canvas_ = new OffscreenCanvas(_bitmap_.width, _bitmap_.height);

    let _ctx_ = null;
    let _trying_ = [ "extended-sRGB", "extended-srgb", "scrgb", "scRGB", "srgb", "sRGB" ];
    for (const _try_ of _trying_) {
        try {
            _ctx_ = _canvas_.getContext("2d", {
                ["color-space"]: _try_,
                colorSpaceConversion: "none",
                colorSpace: _try_,
                colorType: "float16",
                storageFormat: "float16",
                pixelFormat: "float16"
            });
            break;
        } catch (e) {
            //console.warn("ColorSpace " + _try_ + " not supported...");
        }
    };
    if (!_ctx_) { _ctx_ = _canvas_.getContext("2d"); };

    _ctx_.filter = typeof CanvasFilter != "undefined" ? new CanvasFilter(
        [{
            filter: "colorMatrix",
            type: "matrix",
            values: [
                0, 0, 0, 0, 1,
                0, 0, 0, 0, 1,
                0, 0, 0, 0, 1,
                1, 0, 0, 0, 0
            ],
        }]
    ) : "url()";
    _ctx_.drawImage(_bitmap_,0,0);
    
    return await createImageBitmap(_canvas_, {
        colorSpaceConversion: "none",
        resizeQuality: "pixelated"
    });
}


// TODO: prefer use-profile instead
const _deepSpace_ = function(type, options) {
    let _ctx_ = null;
    let _trying_ = [
        //"rec2020", "rec-2020",
        //"rec2020-linear", "rec-2020-linear", 
        //"display-p3", 
        "extended-sRGB", "extended-srgb", "scrgb", "srgb" 
    ];

    for (const _try_ of _trying_) {
        try {
            _ctx_ = this.getContext(type, {...{
                ["color-space"]: _try_,
                colorSpaceConversion: "none",
                colorSpace: _try_,
                colorType: "float16",
                storageFormat: "float16",
                pixelFormat: "float16"
            }, options});
            break;
        } catch (e) {
            //console.warn("ColorSpace " + _try_ + " not supported...");
        }
    };

    if (!_ctx_) { return this.getContext(type, options); };
    return _ctx_;
}

//
if (typeof HTMLCanvasElement != "undefined") {
    HTMLCanvasElement.prototype.getContextDeepSpace = _deepSpace_;
}

if (typeof OffscreenCanvas != "undefined") {
    OffscreenCanvas.prototype.getContextDeepSpace = _deepSpace_;
}

//
const loadBitmapAsBlob = async (url) => {
    let $url = await url;
    return createImageBitmap(($url instanceof Blob) ? $url : (await fetch($url, { mode: "cors" }).then(res => res.blob())), {
        colorSpaceConversion: "none",
        resizeQuality: "pixelated"
    });
}

//
const blobToArrayBuffer = async(url) => {
    const $url = await url;
    if ($url instanceof Blob) {
        const FR = new FileReader();
        const PM = new Promise((RV, RJ) => { FR.onload = ()=>RV(FR.result), FR.onerror = RJ; });
        FR.readAsArrayBuffer($url);
        return PM;
    }
    return await fetch(($url instanceof Blob) ? URL.createObjectURL($url) : $url, { mode: "cors" }).then(res => res.arrayBuffer())
}

//
const saveBlob = (url, name) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href =  url;
    a.download = name;
    a.click();
    a.remove();
    return url;
}

//
const concat = (resultConstructor, ...arrays) => {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

//
const encodeURL = async (chunked, type, blob = false) => {
    chunked = chunked.map((chunk)=>{
        if (typeof chunk === "string") {
            return new TextEncoder().encode(chunk);
        }
        return chunk;
    });

    const BLOB = new Blob(chunked, {type});
    if (blob) { return URL.createObjectURL(BLOB); };
    {
        const FR = new FileReader();
        FR.readAsDataURL(BLOB);
        const READ = new Promise(resolve => {
            FR.onload = ()=>resolve(FR.result);
        });
        return await READ;
    }

    //return `data:${type};base64,${window.btoa(String.fromCharCode(...concat(Uint8Array, ...chunked)))}`;
}

//
const toBlob = (canvas, mimeType, quality) => {
    return new Promise((resolve, reject)=>{
        canvas.toBlob(resolve, mimeType, quality);
    });
}

const encodeSvg = (svgString) => {
    return svgString.replace('<svg',(~svgString.indexOf('xmlns')?'<svg':'<svg xmlns="http://www.w3.org/2000/svg"'))
          .replace(/"/g, '\'')
          .replace(/%/g, '%25')
          .replace(/#/g, '%23')       
          .replace(/{/g, '%7B')
          .replace(/}/g, '%7D')         
          .replace(/</g, '%3C')
          .replace(/>/g, '%3E')
          .replace(/\s+/g,' ');
}

const getSharedImageData = (ctx, x, y, w_or_image, h) => {
    let w = w_or_image;
    if (w_or_image.data) { w = w_or_image.width, h = w_or_image.height };
    const shared = (w_or_image.data?.buffer || w_or_image.data) || new (typeof SharedArrayBuffer != "undefined" ? SharedArrayBuffer : ArrayBuffer)(w*h*4);
    for (let Y=0;Y<h;Y++) {
        new Uint32Array(shared, Y*w*4, w).set(new Uint32Array(ctx.getImageData(x, y+Y, w, 1).data.buffer));
    }
    return {
        width: w,
        height: h,
        data: shared
    };
}


/* WRAP PROMISE */
let handlers = {};
const wrap = function (target) {
    if (typeof target === 'object' && target && typeof target.then === 'function') {
        // The target needs to be stored internally as a function, so that it can use
        // the `apply` and `construct` handlers.
        var targetFunc = function () { return target; };
        targetFunc._promise_chain_cache = Object.create(null);
        return new Proxy(targetFunc, handlers);
    }
    return target;
};
// original was written in TS > 2.5, you might need a polyfill :
if (typeof Reflect === 'undefined') {
    require('harmony-reflect');
}
Object.assign(handlers, {
    get: function (target, property) {
        if (property === 'inspect') {
            return function () { return '[chainable Promise]'; };
        }
        if (property === '_raw') {
            return target();
        }
        if (typeof property === 'symbol') {
            return target()[property];
        }
        // If the Promise itself has the property ('then', 'catch', etc.), return the
        // property itself, bound to the target.
        // However, wrap the result of calling this function.
        // This allows wrappedPromise.then(something) to also be wrapped.
        if (property in target()) {
            const isFn = typeof target()[property] === 'function';
            if (property !== 'constructor' && !property.startsWith('_') && isFn) {
                return function () {
                    return wrap(target()[property].apply(target(), arguments));
                };
            }
            return target()[property];
        }

        // 
        let handleCache = async (result)=>{ return (await result[property]); };

        // If the property has a value in the cache, use that value.
        if (Object.prototype.hasOwnProperty.call(target._promise_chain_cache, property)) {
            return target._promise_chain_cache[property].then(handleCache);
        }
        // If the Promise library allows synchronous inspection (bluebird, etc.),
        // ensure that properties of resolved
        // Promises are also resolved immediately.
        const isValueFn = typeof target().value === 'function';
        if (target().isFulfilled && target().isFulfilled() && isValueFn) {
            return wrap(target().constructor.resolve(target().value()[property]));
        }
        // Otherwise, return a promise for that property.
        // Store it in the cache so that subsequent references to that property
        // will return the same promise.
        target._promise_chain_cache[property] = wrap(target().then(async function (result) {
            if (typeof result != "undefined" && (typeof result === 'object' || typeof result === 'function')) {
              //return wrap(result[property]);
              return result; // TODO correct cache support
            }
            const _p = `"${property}" of "${result}".`;
            throw new TypeError(`Promise chain rejection: Cannot read property ${_p}`);
        }));
        return target._promise_chain_cache[property].then(handleCache);
    },
    apply: function (target, thisArg, args) {
        // If the wrapped Promise is called, return a Promise that calls the result
        return wrap(target().constructor.all([target(), thisArg]).then(async function (results) {
            if (typeof results[0] === 'function') {
                return wrap(Reflect.apply(results[0], results[1], await Promise.all(args)));
            }
            throw new TypeError(`Promise chain rejection: Attempted to call ${results[0]}` +
                ' which is not a function.');
        }));
    },
    construct: function (target, args) {
        return wrap(target().then(async function (result) {
            return wrap(Reflect.construct(result, await Promise.all(args)));
        }));
    }
});
// Make sure all other references to the proxied object refer to the promise itself,
// not the function wrapping it
Object.getOwnPropertyNames(Reflect).forEach(function (handler) {
    handlers[handler] = handlers[handler] || function (target, ...args) {
      //return Reflect[handler](target(), ...args);
      // prefer to apply with result object
      return wrap(target().then((results)=>{
        return Reflect[handler](results, ...args);
      }));
    };
});

const _LOG_ = (_got_)=>{
    console.log(_got_);
    return _got_;
}

//
const _CS_ = typeof document != "undefined" ? document.currentScript : {};
const _PATH_ = ((((_CS_ ? (_CS_.src||"") : (import.meta.url||"")).split('?')[0]||"")||"").split('/').slice(0, -1).join('/')+'/')||"";
const _loader_ = async(url)=>{
    try {
        const _txt_ = (await import(url + "?raw"))?.default;
        if (_txt_) { return _txt_; };
    } catch(e) {};
    return (await (await fetch(_PATH_ + url)).text());
}

/*
function getAllFuncs(toCheck) {
  const props = [];
  let obj = toCheck;
  do {
      props.push(...Object.getOwnPropertyNames(obj));
  } while (obj = Object.getPrototypeOf(obj));

  return props.sort().filter((e, i, arr) => {
     if (e!=arr[i+1] && e != "caller" && e != "callee" && e != "arguments" && typeof toCheck[e] == 'function') return true;
  });
}

function getAllGetters(toCheck) {
  let list = [];
  let obj = toCheck;
  do {
    let names = Object.getOwnPropertyNames(obj);
    list.push(...names.map((name)=>{
      return {
        name: name,
        descriptor: Object.getOwnPropertyDescriptor(obj, name)
      }
    } ));
  } while (obj = Object.getPrototypeOf(obj));

  list = list.sort((a, b)=>{
    return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
  }).filter((e, i, arr) => {
    let descriptor = e.descriptor;
    if (e.name!=(arr[i+1]?arr[i+1].name:"") && (descriptor.get)) return true;
  });

  return list.map((p)=>{return p.name;});
}

function getAllSetters(toCheck) {
  let list = [];
  let obj = toCheck;
  do {
    let names = Object.getOwnPropertyNames(obj);
    list.push(...names.map((name)=>{
      return {
        name: name,
        descriptor: Object.getOwnPropertyDescriptor(obj, name)
      }
    } ));
  } while (obj = Object.getPrototypeOf(obj));

  list = list.sort((a, b)=>{
    return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
  }).filter((e, i, arr) => {
    let descriptor = e.descriptor;
    if (e.name!=(arr[i+1]?arr[i+1].name:"") && (descriptor.set)) return true;
  });

  return list.map((p)=>{return p.name;});
}
*/

const createImageBitmapAsync = async (_promise)=>{
    return await createImageBitmap(await _promise, {
        colorSpaceConversion: "none",
        resizeQuality: "pixelated"
    });
}

const createOffscreenCanvas = (...args)=> {
    return new OffscreenCanvas(...args);
}

//
const promiseDomContentLoaded = ()=> {
    const _target_ = {};
    const _promise_ = new Promise((r, c)=>{
        document.addEventListener("DOMContentLoaded", _target_._request = ()=>{
            _target_._catch = null, _target_._request = null; r(_target_);
        });
        _target_._catch = (_r_)=> {c(_r_); _target_._catch = null;};
    });
    return new Proxy(_promise_, {
        get(target, name) { 
            if (name == "cancel") return ()=>{
                document.removeEventListener(_target_._request); _target_._request = null;
                _target_._catch("Request animation frame was canceled");
            } 
            return target[name].bind(target);  
        }
    });
}

//
const promiseAnimationFrame = ()=> {
    const _target_ = {};
    const _promise_ = new Promise((r, c)=>{
        _target_._request = requestAnimationFrame(()=>{
            _target_._catch = null, _target_._request = null; r(_target_);
        });
        _target_._catch = (_r_)=> {c(_r_); _target_._catch = null;};
    });
    return new Proxy(_promise_, {
        get(target, name) {
            if (name == "cancel") return ()=>{
                cancelAnimationFrame(_target_._request); _target_._request = null;
                _target_._catch("Request animation frame was canceled");
            } 
            return target[name].bind(target); 
        }
    });
}

//
const promiseTimeout = (ms = 0)=> {
    const _target_ = {};
    const _promise_ = new Promise((r, c)=>{
        _target_._request = setTimeout(()=>{
            _target_._catch = null, _target_._request = null; r(_target_);
        }, ms);
        _target_._catch = (_r_)=> {c(_r_); _target_._catch = null;};
    });
    return new Proxy(_promise_, {
        get(target, name, receiver) { 
            
            if (name == "cancel") return ()=>{
                clearTimeout(_target_._request); _target_._request = null;
                _target_._catch("Timeout was canceled");
            }
            return target[name].bind(target);
        }
    });
}

//
export {
    promiseAnimationFrame, promiseTimeout, promiseDomContentLoaded, exchange, createSRGBAlphaBitmap, 
    _LOG_, _loader_, createImageBitmapAsync, createDOMCanvas, loadImageBitmap, blobToArrayBuffer, createOffscreenCanvas, toBlob, encodeURL, concat, saveBlob, loadBitmapAsBlob, provideForWorker, loadBitmapThroughput, uuidv4, loadImage, swap32, encodeSvg, getSharedImageData, wrap
}
