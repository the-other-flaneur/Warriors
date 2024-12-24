// Vector2 class (previously defined)
export class Vector2 {
    constructor(public x: number = 0, public y: number = 0) {}

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2 {
        const mag = this.magnitude();
        return mag > 0 ? new Vector2(this.x / mag, this.y / mag) : new Vector2();
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    zero(): Vector2 {
        return new Vector2();
    }
}