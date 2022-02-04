import { GameObject } from './GameObject';

export class Ball extends GameObject {
    radius: number = 10;
    color: string = 'yellow';
    private _initColor: string = 'yellow';
    private _collisionColor: string = 'red';
    private _useColoredCollision: boolean = false;
    s = 0;
    e = Math.PI * 2;

    draw(drawSpeedVector?: boolean): this {
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, this.s, this.e);
        this.context.fill();
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

    setCollision(collision: boolean): this {
        if (this._useColoredCollision) {
            this.color = collision ? this._collisionColor : this._initColor;
        }
        return super.setCollision(collision);
    }
}
