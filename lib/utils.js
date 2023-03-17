const swap32 = (val) => {
    return ((val & 0xFF) << 24)
           | ((val & 0xFF00) << 8)
           | ((val >> 8) & 0xFF00)
           | ((val >> 24) & 0xFF);
}

//
const loadImage = async (url) => {
    let image = new Image();
    image.decoding = "async";
    image.fetchPriority = "high";
    image.loading = "eager";

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
            const single = (ev) => { self.removeEventListener('message', single); if (ev.id == id) { R(ev.data.svg); }; };
            self.addEventListener('message', single); let T = [];
            if (url instanceof ArrayBuffer || 
                url instanceof SharedArrayBuffer) 
                { T.push([url]); }
            // if are blob, make as URL
            if (url instanceof Blob) { url = URL.createObjectURL(url); };
            self.postMessage({ id: uuidv4(), svg: "request", url }, ...T);
        });
    } else {
        return createImageBitmap(await loadImage(url));
    }
}

// needs interface for worker
const provideForWorker = (worker) => {
    worker.addEventListener('message', async (ev) => {
        let bitmap = await createImageBitmap(await loadImage(ev.data.url));
        worker.postMessage({id: ev.data.id, svg: bitmap}, [bitmap]);
    });
}

//
const loadBitmapAsBlob = async (url) => {
    let $url = await url;
    return createImageBitmap(($url instanceof Blob) ? $url : (await fetch($url).then(res => res.blob())));
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

    //return `data:${type};base64,${btoa(String.fromCharCode(...concat(Uint8Array, ...chunked)))}`;
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

const getSharedImageData = (ctx, x, y, w, h, shared) => {
    shared = shared || new SharedArrayBuffer(w*h*4);
    for (let Y=0;Y<h;Y++) {
        new Uint32Array(shared, Y*w, w).set(new Uint32Array(ctx.getImageData(x, y, w, 1).data.buffer));
    }
    return shared;
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
        target._promise_chain_cache[property] = wrap(target().then(function (result) {
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
        return wrap(target().constructor.all([target(), thisArg]).then(function (results) {
            if (typeof results[0] === 'function') {
                return wrap(Reflect.apply(results[0], results[1], args));
            }
            throw new TypeError(`Promise chain rejection: Attempted to call ${results[0]}` +
                ' which is not a function.');
        }));
    },
    construct: function (target, args) {
        return wrap(target().then(function (result) {
            return wrap(Reflect.construct(result, args));
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



export {
    toBlob, encodeURL, concat, saveBlob, loadBitmapAsBlob, provideForWorker, loadBitmapThroughput, uuidv4, loadImage, swap32, encodeSvg, getSharedImageData, wrap
}