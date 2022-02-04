import { GameObject } from './GameObject';

export class Ball extends GameObject {
    radius: number = 10;
    color: string = 'yellow';
    private _initColor: string = 'yellow';
    s = 0;
    e = Math.PI * 2;

    setPreferences(radius: number, color: string = this._initColor): Ball {
        this.radius = radius;
        this._initColor = color;
        this.color = color;
        return this;
    }

    setCollision(collision: boolean): this {
        this.color = collision ? 'red' : this._initColor;
        return super.setCollision(collision);
    }
}
