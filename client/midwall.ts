import { Vector2 } from "./vector2.js";

export class Midwall {
    position: Vector2;
    size: Vector2;

    constructor(canvasWidth: number, canvasHeight: number) {

         // Size relative to canvas
         this.size = new Vector2(
            canvasWidth * 0.03,  // width
            canvasHeight * 0.3  // height   
         );
 
         // Start in the center horizontally, near the bottom vertically
         this.position = new Vector2(
                (canvasWidth - this.size.x) / 2,
                canvasHeight - this.size.y
         );
    }

    update(canvasWidth: number, canvasHeight: number) {
        // Size relative to canvas
        this.size = new Vector2(
            canvasWidth * 0.03,  // width
            canvasHeight * 0.3  // height   
         );
 
         // Start in the center horizontally, near the bottom vertically
         this.position = new Vector2(
                (canvasWidth - this.size.x) / 2,
                canvasHeight - this.size.y
         );
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Draw player as red rectangle
        ctx.fillStyle = "black";
        ctx.fillRect(
            this.position.x, 
            this.position.y, 
            this.size.x, 
            this.size.y
        );

    }
}