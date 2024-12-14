// player.ts
export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    keys: Set<string>;
    speed: number;
    canvasWidth: number;
    canvasHeight: number;

    constructor(canvasWidth: number, canvasHeight: number) {
      
      this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

      // 10% of canvas size
      this.width = canvasWidth * 0.1;
      this.height = canvasHeight * 0.1;
      

        // start player in center of canvas
        this.x = (canvasWidth - this.width);
      this.y = (canvasHeight - this.height);

      // relative speed to canvas width
      this.speed =  canvasWidth * 0.01;
      
      this.keys = new Set();
    
        // Bind event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => this.keys.add(e.code));
        window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    }

    update(ctx: CanvasRenderingContext2D) {
        // move player based on keys pressed
        if(this.keys.has('ArrowLeft')) {
            this.x -= this.speed;
        }
        if(this.keys.has('ArrowRight')) {
            this.x += this.speed;
        }
        if(this.keys.has('ArrowUp')) {
            this.y -= this.speed;
        }
        if(this.keys.has('ArrowDown')) {
            this.y += this.speed;
        }

        // gravity
        this.y += this.speed * 0.5;

        // horizontal boundaries
        this.x = Math.max(0, Math.min(this.x, ctx.canvas.width - this.width));

        // vertical boundaries
        const topBoundary = ctx.canvas.height * 0.01; // 70% of canvas height
        const bottomBoundary = ctx.canvas.height - this.height;

        this.y = Math.max(topBoundary, Math.min(this.y, bottomBoundary));
    }
  
    draw(ctx: CanvasRenderingContext2D) {
        // Fallback - draw a red rectangle if image fails
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }