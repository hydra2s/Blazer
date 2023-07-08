 // Ha-ha, JNG can be opended in browser by such way...
 import {
    initializeImageMagick,
    ImageMagick,
    Magick,
    MagickFormat,
    Quantum,
} from './@imagemagick/magick-wasm';

initializeImageMagick("./@imagemagick/magick-wasm/dist/magick.wasm").then(async() => {
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
});