export class APNGPreRender {
    constructor(width, height, frames) {
        this.canvas = new OffscreenCanvas(width, height);
        this.ctx = this.canvas.getContext("2d", { desynchronized: true, willReadFrequently: true });
        this.frames = frames;
    }

    async prerender() {
        const ctx = this.ctx, canvas = this.canvas;
        const images = await Promise.all(this.frames.map((F)=>F.image));
        let prevF = null, prevI = null;

        const P = this.frames.map((F,I)=>[F,I]);
        const Fm = [];
        for await (const p of P) {
            const [F,I] = p;
            if (I == 0) { 
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
                if (F.disposeOp == 2) F.disposeOp = 1; 
                prevF = null; 
            };

            if (prevF && prevF.disposeOp) { ctx.clearRect(prevF.left, prevF.top, prevF.width, prevF.height); }
            if (prevF && prevF.disposeOp == 2) {
                ctx.drawImage(prevI, prevF.left, prevF.top, prevF.width, prevF.height);
            }
            prevF = F, prevI = null;

            if (F && F.disposeOp == 2) {
                prevI = await createImageBitmap(this.canvas, F.left, F.top, F.width, F.height);
            }
            if (F.blendOp == 0) { ctx.clearRect(F.left, F.top, F.width, F.height); }
            ctx.drawImage(this.images[I], F.left, F.top);
            Fm.push(await createImageBitmap(this.canvas, 0, 0, this.canvas.width, this.canvas.height));
        }
        return Fm;
    }
}

export class APNGDecoder {
    constructor() {
        
    }
}

export class APNGEncoder {
    constructor() {
        
    }
}
