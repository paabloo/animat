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
    isHidden = false;

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

    draw(drawSpeedVector?: boolean): this {
        if (drawSpeedVector) {
            this.context.beginPath();
            this.context.moveTo(this.x, this.y);
            this.context.lineTo((this.x + this.speedVector.x / 4), this.y + (-this.speedVector.y / 4));
            this.context.stroke();
        }
        return this;
    }

    setSpeedVector(speedVector: Victor): this {
        this.speedVector = speedVector;
        return this;
    }

    updatePosition(secondsPassed: number): this {
        this.speedVector.y -= settings.gravity * secondsPassed;

        this.x += this.speedVector.x * secondsPassed;
        this.y += (-this.speedVector.y) * secondsPassed;

        return this;
    }

    setCollision(collision: boolean): this {
        this.isColliding = collision;
        return this;
    }

    setHidden(hidden: boolean): this {
        this.isHidden = hidden;
        return this;
    }
}
