import { Vector2 } from "./vector2";

export class Tower {
    size: Vector2;
    position: Vector2;

    constructor() {
      this.size = new Vector2(50, 50);
        this.position = new Vector2(0, 0);  
    }
}