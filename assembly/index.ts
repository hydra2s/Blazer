export function makeBGR(imageData: usize, width: u32, height: u32): void {
  for (let I:u32=0;I<(width*height)*4;I+=16) {
    let u8x4x4: v128 = v128.load(imageData+I);
    u8x4x4 = v128.swizzle(u8x4x4, i8x16(2,1,0,3, 6,5,4,7, 10,9,8,11, 14,13,12,15));
    v128.store(imageData+I, u8x4x4);
  }
}

export function alloc(size: u32): usize {
  return heap.alloc(size);
}