import Victor from 'victor';
import { v4 as uuidv4 } from 'uuid';
import settings from './settings';
import { Ball } from './Board/Ball';

export class GameObject {
    id: string;
    context: CanvasRenderingContext2D | null;
    x: number;
    y: number;
    speedVector: Victor;
    mass: number;
    isColliding: boolean;
    collidingWith: GameObject | Ball | null;
    isHidden: boolean = false;
    isPlayer: boolean = false;

    private _playerSpeed: number = 200;

    constructor(context: CanvasRenderingContext2D | null, x: number, y: number, vx: number, vy: number, mass = 1) {
        this.id = uuidv4();
        this.context = context;
        this.x = x;
        this.y = y;
        this.speedVector = new Victor(vx, vy);
        this.mass = mass;

        this.isColliding = false;
        this.collidingWith = null;

        return this;
    }

    addContext(ctx: CanvasRenderingContext2D): this {
        if (!this.context) {
            this.context = ctx;
        }

        return this;
    }

    draw(drawSpeedVector?: boolean): this {
        if (drawSpeedVector) {
            const ctx = this.context as CanvasRenderingContext2D;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo((this.x + this.speedVector.x / 4), this.y + (-this.speedVector.y / 4));
            ctx.stroke();
        }
        return this;
    }

    setPlayer(): this {
        this.isPlayer = true;
        return this;
    }

    setSpeedVector(speedVector: Victor): this {
        if (!this.isPlayer) {
            this.speedVector = speedVector;
        }
        return this;
    }

    setPosition(x: number, y: number): this {
        if (!this.isPlayer) {
            this.x = x;
            this.y = y;
        }

        return this;
    }

    updatePosition(secondsPassed: number): this {
        if (!this.isPlayer) {
            this.speedVector.y -= settings.gravity * secondsPassed;
        }

        this.x += this.speedVector.x * secondsPassed;
        this.y += (-this.speedVector.y) * secondsPassed;

        return this;
    }

    setCollision(collision: boolean, collidingWith?: GameObject | Ball): this {
        this.collidingWith = collision && collidingWith ? collidingWith : null;
        this.isColliding = collision;
        return this;
    }

    moveObject(keys: {ArrowLeft: boolean; ArrowUp: boolean; ArrowRight: boolean; ArrowDown: boolean}): this {
        if (!this.isPlayer) return this;
        if (keys.ArrowUp && !keys.ArrowDown) {
            this.speedVector.y = this._playerSpeed;
        }
        if (!keys.ArrowUp && keys.ArrowDown) {
            this.speedVector.y = -this._playerSpeed;
        }
        if (keys.ArrowUp === keys.ArrowDown) {
            this.speedVector.y = 0;
        }

        if (keys.ArrowLeft && !keys.ArrowRight) {
            this.speedVector.x = -this._playerSpeed;
        }
        if (!keys.ArrowLeft && keys.ArrowRight) {
            this.speedVector.x = this._playerSpeed;
        }
        if (keys.ArrowLeft === keys.ArrowRight) {
            this.speedVector.x = 0;
        }
        return this;
    }

    setHidden(hidden: boolean): this {
        this.isHidden = hidden;
        return this;
    }
}
