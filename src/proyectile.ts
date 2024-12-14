import { Vector2 } from './vector2.js';
import { Player } from './player.js';

export class Proyectile {
    shooter: Player;
    position: Vector2;
    size: Vector2;
    velocity: Vector2;
    speed: number;
    canvasBounds: Vector2;
    gravityStrength: number;

    // State properties
    isHit: boolean;

    constructor(canvasWidth: number, canvasHeight: number, shooter: Player) {

        this.shooter = shooter;

        // Size relative to canvas
        this.size = new Vector2(
            shooter.size.x / 2,  // width (proportional to canvas)
            shooter.size.y / 2   // height (proportional to canvas)
        );

        // Start in the player's left side, centered vertically
        this.position = new Vector2(
            shooter.position.x,  // Left side of player
            shooter.position.y,
        );

        // Velocity specifically to the left with slight upward angle
        this.velocity = new Vector2(-3, -0.2);  // Strong left movement with slight upward trajectory

        this.gravityStrength = canvasHeight * 0.0002;  // Gravity relative to canvas height
        
        // Speed and physics parameters
        this.speed = canvasWidth * 0.02;
        this.canvasBounds = new Vector2(canvasWidth, canvasHeight);

        // Initial state
        this.isHit = false;
    }

    update() {
        if (!this.isHit) {
            // Apply velocity
            this.position = this.position.add(this.velocity.multiply(this.speed));

            // Apply simple gravity
            this.velocity.y += 0.1;

            // Apply gravity
            this.velocity.y += this.gravityStrength;

            // Check bounds (hit if goes off screen or hits ground)
            if (this.position.y >= this.canvasBounds.y || 
                this.position.x <= 0) {
                this.isHit = true;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isHit) {
            // Draw as red rectangle
            ctx.fillStyle = 'blue';
            ctx.fillRect(
                this.position.x,
                this.position.y,
                this.size.x,
                this.size.y
            );
        }
    }
}