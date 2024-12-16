import { Player } from './player.js';
import { Proyectile } from './proyectile.js';
import { Midwall } from './midwall.js';

const socket = (window as any).io();

if (socket) {
    console.log('Connected to server');
}

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.fillStyle = 'white';

class game {
    ctx: CanvasRenderingContext2D;
    player: Player;
    midwall: Midwall;

    constructor(ctx: CanvasRenderingContext2D, player: Player) {
        this.ctx = ctx;
        this.player = player; 
        this.midwall = new Midwall(this.ctx.canvas.width, this.ctx.canvas.height);
        window.addEventListener('resize', () => this.resize());
        requestAnimationFrame(() => this.update());
        requestAnimationFrame(() => this.draw());
        this.resize();
    }

    update() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);


        // update midwall
        this.midwall.update(this.ctx.canvas.width, this.ctx.canvas.height);

        // update player
        this.player.update(ctx, this.midwall);

        // proyectiles
        this.player.clientProyectiles.forEach((proyectile: Proyectile) => {
            proyectile.update();            

            if (proyectile.isHit) {
                const index = this.player.clientProyectiles.indexOf(proyectile);
                this.player.clientProyectiles.splice(index, 1);
            }
        });

        // call gameLoop again
        requestAnimationFrame(() => this.update());
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(10, 10, this.ctx.canvas.width - 20, this.ctx.canvas.height - 20);

        // background
        this.midwall.draw(this.ctx);

        this.player.draw(this.ctx);

        // proyectiles
        this.player.clientProyectiles.forEach((proyectile: Proyectile) => {
            proyectile.draw(this.ctx);
        });

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
