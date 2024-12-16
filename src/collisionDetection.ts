import { Vector2 } from "./vector2.js";

export class CollisionDetector {
    // Axis-Aligned Bounding Box (AABB) Collision Detection
    static checkAABBCollision(obj1: { 
        position: Vector2, 
        size: Vector2 
    }, obj2: { 
        position: Vector2, 
        size: Vector2 
    }): boolean {
        return (
            obj1.position.x < obj2.position.x + obj2.size.x &&
            obj1.position.x + obj1.size.x > obj2.position.x &&
            obj1.position.y < obj2.position.y + obj2.size.y &&
            obj1.position.y + obj1.size.y > obj2.position.y
        );
    }

    // Circle Collision Detection
    static checkCircleCollision(obj1: { 
        position: Vector2, 
        size: Vector2 
    }, obj2: { 
        position: Vector2, 
        size: Vector2 
    }): boolean {
        // Calculate centers of objects
        const center1 = new Vector2(
            obj1.position.x + obj1.size.x / 2,
            obj1.position.y + obj1.size.y / 2
        );

        const center2 = new Vector2(
            obj2.position.x + obj2.size.x / 2,
            obj2.position.y + obj2.size.y / 2
        );

        // Calculate radius (using smaller dimension)
        const radius1 = Math.min(obj1.size.x, obj1.size.y) / 2;
        const radius2 = Math.min(obj2.size.x, obj2.size.y) / 2;

        // Calculate distance between centers
        const distance = this.calculateDistance(center1, center2);

        // Check if distance is less than sum of radii
        return distance < (radius1 + radius2);
    }

    // Distance between two vectors
    static calculateDistance(vec1: Vector2, vec2: Vector2): number {
        const dx = vec1.x - vec2.x;
        const dy = vec1.y - vec2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Collision with screen boundaries
    static checkScreenBoundaryCollision(obj: { 
        position: Vector2, 
        size: Vector2 
    }, canvasWidth: number, canvasHeight: number): boolean {
        return (
            obj.position.x < 0 ||
            obj.position.x + obj.size.x > canvasWidth ||
            obj.position.y < 0 ||
            obj.position.y + obj.size.y > canvasHeight
        );
    }
}