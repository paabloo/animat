import { GameObject } from '../GameObject';

export class Ball extends GameObject {
    radius: number = 10;
    color: string = 'yellow';
    private _initColor: string = 'yellow';
    private _collisionColor: string = 'red';
    private _useColoredCollision: boolean = false;
    s = 0;
    e = Math.PI * 2;

    draw(drawSpeedVector?: boolean): this {
        const ctx = this.context as CanvasRenderingContext2D;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.s, this.e);
        ctx.fill();
        if (this.isPlayer) {
            ctx.fillStyle = 'green'
            ctx.font = "12px Arial";
            ctx.fillText(`${this.speedVector.x.toFixed(1)}, ${this.speedVector.y.toFixed(1)}`, this.x - this.radius, this.y);
        }
        return super.draw(drawSpeedVector);
    }

    useColoredCollision(useColor: boolean, color?: string): this {
        this._useColoredCollision = useColor;
        if (color) {
            this._collisionColor = color;
        }
        return this;
    }

    setPreferences(radius: number, color: string = this._initColor): this {
        this.radius = radius;
        this.mass = radius / 10;
        this._initColor = color;
        this.color = color;
        return this;
    }

    setCollision(collision: boolean, collidingWith?: GameObject | Ball): this {
        if (this._useColoredCollision) {
            this.color = collision ? this._collisionColor : this._initColor;
        }
        return super.setCollision(collision, collidingWith);
    }
}
