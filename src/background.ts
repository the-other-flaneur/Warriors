
export class Background {
    halfWidth: number;
    wallWidth: number;
    wallHeight: number;
    base: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.halfWidth = canvasWidth / 2;
        this.wallWidth = canvasWidth / 10;
        this.wallHeight = canvasHeight / 3;
        this.base = canvasHeight;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.halfWidth - (this.wallWidth / 2), this.base - this.wallHeight, this.wallWidth, this.wallHeight);
    }
}