import { Vector2 } from './vector2.js';
import { Proyectile } from './proyectile.js';

export class Player {
    position: Vector2;
    size: Vector2;
    velocity: Vector2;
    acceleration: Vector2;
    speed: number;
    keys: Set<string>;
    canvasBounds: Vector2;
    clientProyectiles: Proyectile[] = [];
    
    // Gravity and jump-related properties
    isGrounded: boolean;
    jumpStrength: number;
    gravityStrength: number;
  
    constructor(canvasWidth: number, canvasHeight: number) {
        // Canvas bounds
        this.canvasBounds = new Vector2(canvasWidth, canvasHeight);

        // Size relative to canvas
        this.size = new Vector2(
            canvasWidth * 0.1,  // width
            canvasHeight * 0.3  // height
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
        this.speed = canvasWidth * 0.01;
        this.gravityStrength = canvasHeight * 0.0002;  // Gravity relative to canvas height
        this.jumpStrength = canvasHeight * 0.03;      // Jump strength relative to canvas height

        // Grounded state
        this.isGrounded = false;

        // Keys pressed
        this.keys = new Set();

        // Proyectiles
        this.clientProyectiles = [];
    
        // Bind event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.code);
            
            // Jump when arrowup is pressed and player is grounded
            if (e.code === 'ArrowUp' && this.isGrounded) {
                this.jump();
            }

            // Shoot when Space is pressed
            if (e.code === 'Space') {
                this.shoot();
            }
        });
        window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    }

    shoot() {
        // Create a new projectile
        console.log('shooting');
        const projectile = new Proyectile(this.canvasBounds.x, this.canvasBounds.y, this);
        this.clientProyectiles.push(projectile);
        console.log(this.clientProyectiles);
    }

    jump() {
        if (this.isGrounded) {
            // Apply upward velocity
            this.velocity.y = -this.jumpStrength;
            this.isGrounded = false;
        }
    }

    update(ctx: CanvasRenderingContext2D) {
        // Horizontal movement
        const movement = new Vector2();
        if(this.keys.has('ArrowLeft')) movement.x -= 1;
        if(this.keys.has('ArrowRight')) movement.x += 1;

        // Normalize movement to prevent diagonal movement being faster
        if (movement.magnitude() > 0) {
            movement.normalize();
        }

        this.canvasBounds.x = ctx.canvas.width;
        this.canvasBounds.y = ctx.canvas.height;

        // Apply horizontal movement
        this.velocity.x = movement.x * this.speed;

        // Apply gravity
        this.velocity.y += this.gravityStrength;

        // Update position based on velocity
        this.position = this.position.add(this.velocity);

        // Ground collision detection
        const groundLevel = this.canvasBounds.y - this.size.y;
        
        if (this.position.y >= groundLevel) {
            // Landed on ground
            this.position.y = groundLevel;
            this.velocity.y = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        // Constrain horizontal movement
        this.position.x = Math.max(0, Math.min(
            this.position.x, 
            this.canvasBounds.x - this.size.x
        ));
    }
  
    draw(ctx: CanvasRenderingContext2D) {
        // Draw player as red rectangle
        ctx.fillStyle = this.isGrounded ? 'green' : 'red';
        ctx.fillRect(
            this.position.x, 
            this.position.y, 
            this.size.x, 
            this.size.y
        );
    }
}