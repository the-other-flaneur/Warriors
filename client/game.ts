import { frontendPlayer } from './frontendPlayer';

interface PlayersCollection {
    [socketId: string]: frontendPlayer;
}

export class game {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frontPlayersCollection: PlayersCollection) {
        this.ctx = ctx;
        this.canvas = canvas;
        window.addEventListener('resize', () => this.resize());
        requestAnimationFrame(() => this.update());
        requestAnimationFrame(() => this.draw(frontPlayersCollection));
        this.resize();
    }

    update() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // call gameLoop again
        requestAnimationFrame(() => this.update());
    }

    draw(frontPlayersCollection: PlayersCollection) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(10, 10, this.ctx.canvas.width - 20, this.ctx.canvas.height - 20);

        // draw players
        Object.values(frontPlayersCollection).forEach((player: frontendPlayer) => {
            player.draw(this.ctx);
        });

        requestAnimationFrame(() => this.draw(frontPlayersCollection));
    }

    resize() {
        const boundingBox = this.canvas.parentElement!.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio;

        this.ctx.canvas.width = boundingBox.width * pixelRatio;
        this.ctx.canvas.height = boundingBox.height * pixelRatio;
        this.ctx.canvas.style.width = `${boundingBox.width}px`;
        this.ctx.canvas.style.height = `${boundingBox.height}px`;
    }
}