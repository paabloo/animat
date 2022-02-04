import Victor from 'victor';
import { v4 as uuidv4 } from 'uuid';
import settings from './settings';

export class GameObject {
    id: string;
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
    speedVector: Victor;
    mass: number;
    isColliding: boolean;

    constructor(context: CanvasRenderingContext2D, x: number, y: number, vx: number, vy: number, mass = 1) {
        this.id = uuidv4();
        this.context = context;
        this.x = x;
        this.y = y;
        this.speedVector = new Victor(vx, vy);
        this.mass = mass;

        this.isColliding = false;

        return this;
    }

    setSpeedVector(speedVector: Victor): this {
        this.speedVector = speedVector;
        return this;
    }

    updatePosition(): this {
        this.x += this.speedVector.x / settings.framesPerSecond;
        this.y += (-this.speedVector.y) / settings.framesPerSecond;
        return this;
    }

    setCollision(collision: boolean): this {
        this.isColliding = collision;
        return this;
    }
}
