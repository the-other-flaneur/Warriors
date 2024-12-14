import { Player } from './player.js';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.fillStyle = 'white';

class game {
    ctx: CanvasRenderingContext2D;
    player: Player;

    constructor(ctx: CanvasRenderingContext2D, player: Player) {
        this.ctx = ctx;
        this.player = player;   
        window.addEventListener('resize', () => this.resize());
        requestAnimationFrame(() => this.draw());
        this.resize();
        this.gameLoop();
    }

    gameLoop() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // update player
        this.player.update(this.ctx);

        // draw player
        this.player.draw(this.ctx);

        // call gameLoop again
        requestAnimationFrame(() => this.gameLoop());
    }

    draw() {
        console.log('drawing game');
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(10, 10, this.ctx.canvas.width - 20, this.ctx.canvas.height - 20);

        this.player.draw(this.ctx);

        requestAnimationFrame(() => this.draw());
    }

    resize() {
        const boundingBox = canvas.parentElement!.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio;

        this.ctx.canvas.width = boundingBox.width * pixelRatio;
        this.ctx.canvas.height = boundingBox.height * pixelRatio;
        this.ctx.canvas.style.width = `${boundingBox.width}px`;
        this.ctx.canvas.style.height = `${boundingBox.height}px`;
    }
}

const player = new Player(ctx.canvas.width, ctx.canvas.height);
const gameInstance = new game(ctx, player);
gameInstance.draw();
