
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const boundingBox = canvas.getBoundingClientRect();
canvas.width = boundingBox.width;
canvas.height = boundingBox.height;

console.log(boundingBox);

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

class game {
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, 800, 600);
    }
}