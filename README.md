# Blazer

Blazer - a new generation of JS multi-tools (image, color, worker, DOM)...

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

## APNG parsing tools

### Current features

- [x] Blazing fast for rendering
- [x] Pre-rendering of frames support
- [x] Decomposition APNG into frames
- [ ] Encoder from canvas

## OpenJNG

### Current features

- [x] Support of Web Workers
- [x] Blazing fast (almost as native)
- [x] JPEG data stream support
- [x] Alpha channel support
    - [x] JPEG support
    - [x] PNG support
- [x] MNG support
- [ ] 16-bit support (shows as 8-bit)
- [ ] Progressive support (shows instantly)

## OpenMNG

### Current features

- [ ] Almost full support of MNG (WIP!)
- [x] MNG-LC support
- [x] JNG support (our unique feature)
- [x] Partial `LOOP` chunk support
    - [x] Nesting support
    - [ ] Ranges support
- [x] Partial `SHOW` chunk support
    - [x] Initial support
    - [ ] Correct functionality
- [x] Partial `FRAM` chunk support
    - [x] Clipping support
- [x] Global Palette support (not tested)
- [ ] Delta frames
    - [ ] PNG frames
    - [ ] JNG frames

## InterCom and InterWork

A sort of Google's Comlink competitor...

### Current features

- [x] Using JSOX encoding for more types
- [x] Almost full support of transferables
- [x] Almost full support of shared memory
- [x] Almost full support of Web Workers
- [x] Almost full support of Web Sockets
- [x] Almost seamless classes and JS usage
- [x] Almost full JS proxies support
