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

export {
    toBlob, encodeURL, concat, saveBlob, loadBitmapAsBlob, provideForWorker, loadBitmapThroughput, uuidv4, loadImage, swap32, encodeSvg
}
