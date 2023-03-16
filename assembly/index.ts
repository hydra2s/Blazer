import { getPixelPack } from "./env"

export function makeARGB(fileData: usize, width: u32, height: u32): void {
  let W: u32 = width*4;
  for (let Y:u32=0;Y<height;Y++) {
    let P: usize = getPixelPack(0,Y,width,1,fileData+Y*W);
    for (let X:u32=0;X<W;X+=16) {
      let pX: usize = P+X;
      v128.store(pX, v128.swizzle(v128.load(pX), i8x16(3,0,1,2, 7,4,5,6, 11,8,9,10, 15,12,13,14)));
    }
  }
}

export function makePNGData(fileData: usize, width: u32, height: u32): void {
  let W: u32 = width*4;
  let a: u16 = 1, b: u32 = 0;
  const REM: u16 = 65521;
  for (let Y:u32=0;Y<height;Y++) {
    let P: usize = fileData+Y*(W+6); 
    store<u8>(0+P, Y==height-1?1:0);
    store<u16>(1+P, (W+1));
    store<u16>(3+P, ~(W+1));

    // lane with filter 0
    store<u8>(5+P, 0); getPixelPack(0,Y,width,1,6+P);

    // TODO: ADLER MAKER!
    for (let X:u32=0;X<(W+1);X+=1) {
      a = (a+load<u8>(5+P+X))%REM;
      b = (b + a)%REM;
      //let pX: usize = P+X;
      //v128.store(pX, v128.swizzle(v128.load(pX), i8x16(3,0,1,2, 7,4,5,6, 11,8,9,10, 15,12,13,14)));
    }
  }
  store<u32>(height*(W+6), ((b << 16) | a));
}

export function alloc(size: u32): usize {
  return heap.alloc(size);
}
