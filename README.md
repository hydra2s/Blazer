# Blazer

Blazer - new BMP or PNG encoder with much more faster encoding...

### Main idea?

- **Support for Browsers and Web.**
- Much more blazing fast encoding images.
- Raw-like image formats (uncompressed).
- Using WebAssembly and SIMD where is possible.
- Using most fastest composition methods where possible.
- Planned almost full Web Workers support.
- Planned caching support (for OpenJNG or static mode).
- Planned real-time image streaming support.
- Don't using slow `setTimeout` methods.
- Full support for `async` and `await`.

# RGBA image format decoder and encoder

Only just for fun...

- https://github.com/bzotto/rgba_bitmap
- https://bzotto.medium.com/introducing-the-rgba-bitmap-file-format-4a8a94329e2c

# OpenJNG

Reincarnation of my oldest project, for Open JNG format in JS and browser. 

### What is JNG?

JNG - JPEG Network Graphics. If be simply, it's JPEG (wrapper) with alpha channel support (PNG or JPG grayscale data). Also support ancillary chunks from PNG.

- https://ru.wikipedia.org/wiki/JNG
- https://en.wikipedia.org/wiki/JPEG_Network_Graphics
- http://www.libpng.org/pub/mng/spec/jng.html

### What I did?

After my 10 years... I decoded (again) JNG data through JPG and PNG browser's native decoders (despite in internets already has JS-based decoders), and composited (RGB and alpha) in WebGPU (for reduce overheads). Now decodes almost blazing fast, even relatively big images. And recoded back into PNG with saving JNG's ancillary chunks.

Yes, I learned almost everything about these things. About 2D context. About WebGL. About WebGPU (begin learning, but good know Vulkan API). About pixels and shaders. About composition and blending. About multi-theading and atomics. About SIMD. About PNG chunks, structs, binary data, difference between view and copy... and giving almost final answer about JNG decoding (except interlacing).

# APNG decoding and canvas, chapter II

Coming soon... probably, in June of 2023 years.

I certainly understand that this is a Chinese knockoff or half-copy of David Mrazeulian's famous original, and is essentially a mockery of his product. But at least it's my complete 2023 remaster of the whole thing. But just listen to my realization and idea. 
- No more unnecessary copying (using the "view" principle), which achieves faster execution speed.
- The chunks are collected almost without any copying. 
- Really works even in Web Worker. 
- Supports async and await.
- Works faster thanks to ImageBitmap instead of ImageData. 
- Implemented PreRender support in ImageBitmap. 
- Really uses Blob objects instead of base64. 
- Uses faster principles than those used 10 years ago. 
- No more unnecessary support for old and obsolete browsers. 
- Lower-level handling and API for APNG format. 
- Smaller implementation itself due to new principles and OOPs. 

# JS WebSocket Intercom

The main task was to implement objects and classes, as well as method calls, over a remote websocket connection. This
library is designed to solve this applied problem. It was originally created for the new game ch2048s, to implement the
internal interface of the game. Or rather, libraries for the game, for its core.

## Season 3, now this is **`InterCom`** and **`InterWork`**

I decided begin development a new library for WebWorkers too. Probably, better and simpler than Google Comlink.

## Season 2

After year of stagnation, I decided to make a Java support. I would to try write inter-connection between Minecraft and
my new renderer, based on Node.js, uses a localhost websocket fastest channel, with sharing native pointers.
Planned to make something alike NVIDIA Remix, or Focal Engine. Also, planned to support a Nuncabola project, which uses
only old LWJGL engine.

## Features

- Automatic arguments conversation and type-detection
- Custom protocol for remote control
- Conflict-less and bidirectional conversation
- Using classes, constructors, functions, properties
- Encoding and decoding argument system
- Connection wrapper

## Install

`npm install https://github.com/helixd2s/ws-comlink.git`

## Usage

### Server

```js
import WSComlink from "ws-comlink";
import {WebSocketServer} from 'ws';

(async()=>{
    class Job {
        constructor() {
            this.work = 2;
        }

        get practice() {
            return 2;
        }

        async doWork(value, callback) {
            // you can call function proxy
            //await callback(this.work);
            return (this.work + value);
        }
    };

    const wss = new WebSocketServer({ port: 8000 });
    wss.on('connection', async function connection(ws) {
        let transmitter = new WSComlink(ws);

        // promise test
        let answer = {};
        let promise = new Promise((res,rej)=>{
            answer.resolve = res;
            answer.reject = rej;
        });
        transmitter.register("answer", answer);

        // wait answer from client
        console.log(await (promise));


        // class test
        transmitter.register("Job", Job);
    });

    wss.on('close', ()=>{
        wss.close();
    });
})();
```

### Client

```js
//import WebSocketWrapper from 'ws-wrapper'; // if you used in browser
import WebSocket from 'ws';

(async()=>{
    const ws = new WebSocket('ws://127.0.0.1:8000/');
    ws.on("open", ()=>{

        function callback(a) {
            console.log("Called with: " + a);
        }

        let receiver = new WSComlink(ws);
        receiver.on("register", async (changes)=>{

            // answer to promise
            if (changes.className == "answer") {
                let answer = receiver.proxy(changes.className);
                answer.resolve("Got answer for promise");
            }
            
            // test class
            if (changes.className == "Job") {
                // get class constructor
                let Job = receiver.proxy(changes.className);

                // try to construct
                let jobs = new Job();

                // try to set
                jobs.work = 1;

                // try getter
                console.log(await jobs.practice);

                // try to get property
                console.log(await jobs.work);

                // try call function
                console.log(await jobs.doWork(2, callback));

                // try to delete property
                delete jobs.work;
                console.log(await jobs.work);
            };
        });

    });
})();

```
