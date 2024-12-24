import { Vector2 } from '../client/vector2';

export interface PlayersCollection {
    [socketId: string]: backendPlayer;
}

/**
 * Manages the game player instances.
*/
export class backManager {
    private players: PlayersCollection = {};
  
    // Add a new player
    addPlayer(socketId: string, player: backendPlayer): void {
        this.players[socketId] = player;
    }
  
    // Remove a player
    removePlayer(socketId: string): void {
        delete this.players[socketId];
    }
  
    // Get a player
    getPlayer(socketId: string): backendPlayer {
        return this.players[socketId];
    }
  
    // Get all players
    getAllPlayers(): PlayersCollection {
        return this.players;
    }
  }

export class backendPlayer {
    id: string;
    position: Vector2;
    size: Vector2;
    velocity: Vector2;
    acceleration: Vector2;
    speed: number;
    keys: Set<string>;
    canvasBounds: Vector2;
    // backProjectiles: Proyectile[] = [];

    // Gravity and jump-related properties
    isGrounded: boolean;
    jumpStrength: number;
    gravityStrength: number;
    movement: Vector2;

    constructor(id: string, canvasWidth: number, canvasHeight: number) {
        this.id = id;
        this.canvasBounds = new Vector2(canvasWidth, canvasHeight);

        // Size relative to canvas
        this.size = new Vector2(
            canvasWidth / 8,  // width
            canvasHeight / 8  // height
        );

        // Start in the center horizontally, near the bottom vertically
        this.position = new Vector2(
            (canvasWidth - this.size.x) / 2,
            canvasHeight - this.size.y * 2
        );

        // Velocity and acceleration vectors
        this.velocity = new Vector2();
        this.acceleration = new Vector2();

        // Speed and physics parameters
        this.speed = canvasWidth * 0.03;
        this.gravityStrength = canvasHeight * 0.003;  // Gravity relative to canvas height
        this.jumpStrength = canvasHeight * 0.07;      // Jump strength relative to canvas height

        // Grounded state
        this.isGrounded = false;

        this.movement = new Vector2();

        // Keys pressed
        this.keys = new Set();

        // Proyectiles
        // this.backProjectiles = [];
    }

    /*
    shoot() {
        // Create a new projectile
        console.log('shooting');
        const projectile = new Proyectile(this.canvasBounds.x, this.canvasBounds.y, this);
        this.backProjectiles.push(projectile);
        console.log(this.backProjectiles);
    }*/

    jump() {
            // Apply upward velocity
            this.velocity.y = -this.jumpStrength;
            this.isGrounded = false;
    }

    update() {
        // Horizontal movement
        let movement = new Vector2();
        if(this.keys.has('ArrowLeft')) movement.x -= 1;
        if(this.keys.has('ArrowRight')) movement.x += 1;

        // Normalize movement to prevent diagonal movement being faster
        if (movement.magnitude() > 0) {
            movement.normalize();
        }

        // this.canvasBounds.x = ctx.canvas.width;
        // this.canvasBounds.y = ctx.canvas.height;

        // Apply horizontal movement
        this.velocity.x = movement.x * this.speed;

        movement = movement.zero();

        // Apply gravity
        this.velocity.y += this.gravityStrength;

        // Update position based on velocity
        this.position = this.position.add(this.velocity);

        // Ground collision detection
        const groundLevel = this.canvasBounds.y - this.size.y * 2;

        if (this.position.y >= groundLevel) {
            // Landed on ground
            this.position.y = groundLevel;
            this.velocity.y = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        // Midwall collision detection
        // const collision = CollisionDetector.checkAABBCollision(this, midwall);

        // calculate left side of midwall
        // const leftSide = midwall.position.x;

        // if (collision) {
        //     console.log('collision detected');
        //     this.position.x = Math.max(0, Math.min(
        //         leftSide - this.size.x, 
        //         this.position.x
        //     ));
        //     this.velocity.x = 0;
        // }

        // Constrain horizontal movement
        this.position.x = Math.max(0, Math.min(
            this.position.x, 
            this.canvasBounds.x - this.size.x
        ));
    }
}