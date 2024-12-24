import { Vector2 } from './vector2.js';
import { Socket } from 'socket.io';
import { wsDriver } from './wsdriver.js';

export interface PlayersCollection {
    [socketId: string]: frontendPlayer;
}

/**
 * Manages the game player instances.
*/
export class frontManager {
    private players: PlayersCollection = {};
  
    // Add a new player
    addPlayer(socketId: string, player: frontendPlayer): void {
        this.players[socketId] = player;
    }
  
    // Remove a player
    removePlayer(socketId: string): void {
        delete this.players[socketId];
    }
  
    // Get a player
    getPlayer(socketId: string): frontendPlayer {
        return this.players[socketId];
    }
  
    // Get all players
    getAllPlayers(): PlayersCollection {
        return this.players;
    }
  }


export class frontendPlayer {
    id: string;
    position: Vector2;
    size: Vector2;
    wsD: wsDriver;
    keys: Set<string>;
    constructor(id: string, position: Vector2, size: Vector2, socket: Socket) {
        this.wsD = new wsDriver(socket);
        this.id = id;
        this.size = size;
        this.position = position;
        this.keys = new Set();  // Keys pressed

        // Bind event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.code);

            // Jump when arrowup is pressed and player is grounded
            if (e.code === 'ArrowUp') {
                this.wsD.keyPress('ArrowUp');
            }
            
            // Shoot when Space is pressed
            if (e.code === 'Space') {
                console.log("space pressed");
            }

            if (e.code === 'ArrowRight') {
                this.wsD.keyPress('ArrowRight');
            }

            if (e.code === 'ArrowLeft') {
                this.wsD.keyPress('ArrowLeft');
            }

        });
        window.addEventListener('keyup', (e) => { this.wsD.keyRelease(e.code); this.keys.delete(e.code); });
    }

    update(position: Vector2) {
        this.position = position;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Draw player as red rectangle
        ctx.fillStyle = 'red'; //this.isGrounded ? 'green' : 'red';
        ctx.fillRect(
            this.position.x, 
            this.position.y, 
            this.size.x, 
            this.size.y
        );
    }
}