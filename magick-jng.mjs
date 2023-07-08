 // Ha-ha, JNG can be opended in browser by such way...
import {
    initializeImageMagick,
    ImageMagick,
    Magick,
    MagickFormat,
    Quantum,
} from './@imagemagick/magick-wasm/dist/index.mjs';

//
const _CS_ = typeof document != "undefined" ? document.currentScript : {};
const _PATH_ = ((((_CS_ ? (_CS_.src||"") : (import.meta.url||"")).split('?')[0]||"")||"").split('/').slice(0, -1).join('/')+'/')||"";
const _loader_ = async(url)=>{
    try {
        const _txt_ = (await import(url + "?url"))?.default;
        if (_txt_) { return _txt_; };
    } catch(e) {};
    return URL.createObjectURL(await (await fetch(_PATH_ + url)).blob());
}

_loader_("./@imagemagick/magick-wasm/dist/magick.wasm").then((url)=>initializeImageMagick(url).then(async() => {
    console.log(Magick.imageMagickVersion);
    console.log('Delegates:', Magick.delegates);
    console.log('Features:', Magick.features);
    console.log('Quantum:', Quantum.depth);

    ImageMagick.read(new Uint8Array(await (await fetch('./img/test.jng')).arrayBuffer()), image => {
        image.write(MagickFormat.Png, data => {
            document.querySelector("#jng").src = URL.createObjectURL(new Blob([data], {type: "image/png"}));
        });
    })
}).catch(err => {
    console.error(err);
}));
