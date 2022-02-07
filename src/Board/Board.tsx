import React, {useRef, useState} from 'react';
import Victor from 'victor';
import Canvas from "../Canvas/Canvas";
import settings from '../settings';
import { Ball } from './Ball';

console.log(settings);
// @ts-ignore
window.v = Victor;

export type Context = CanvasRenderingContext2D;

function hideObjects(ball1: Ball, ball2: Ball): void {
    if (ball1.isPlayer || ball2.isPlayer) return;
    if (ball1.color !== ball2.color) {
        if (ball1.speedVector.lengthSq() < ball2.speedVector.lengthSq()) {
            ball1.setPreferences(settings.ball.radius, ball2.color);
        } else {
            ball2.setPreferences(settings.ball.radius, ball1.color);
        }
    }
}

function detectCollision(balls: Ball[], forwardCollision: (e: number) => void, info: any): void {
    balls.forEach(ball => ball.setCollision(false));

    let obj1;
    let obj2;

    for (let i = 0; i < balls.length; i++) {
        obj1 = balls[i];

        if (obj1.isHidden) continue;
        for (let j = i + 1; j < balls.length; j++) {
            obj2 = balls[j];
            if (obj2.isHidden) continue;

            const vectorBall = new Victor(obj1.x, obj1.y);
            const vectorOtherBall = new Victor(obj2.x, obj2.y);
            let distance = vectorBall.distance(vectorOtherBall);
            let bounce = distance <= obj1.radius + obj2.radius;

            if (bounce) {
                forwardCollision(1);
                info.current++;
                obj1.setCollision(true, obj2);
                obj2.setCollision(true, obj1);
                hideObjects(obj1, obj2);

                let vCollision = {x: obj2.x - obj1.x, y: -obj2.y - (-obj1.y)};
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.speedVector.x - obj2.speedVector.x, y: obj1.speedVector.y - obj2.speedVector.y};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                speed *= settings.bounceFriction;

                obj1.setPosition(obj1.x - vCollisionNorm.x, obj1.y + vCollisionNorm.y);
                obj2.setPosition(obj2.x + vCollisionNorm.x, obj2.y - vCollisionNorm.y);

                if (speed < 0) {
                    continue;
                }

                let impulse = 2 * speed / (obj1.mass + obj2.mass);
                // let impulse = 1;
                obj1.setSpeedVector(new Victor(obj1.speedVector.x - (impulse * obj2.mass * vCollisionNorm.x), obj1.speedVector.y - (impulse * obj2.mass * vCollisionNorm.y)));
                obj2.setSpeedVector(new Victor(obj2.speedVector.x + (impulse * obj1.mass * vCollisionNorm.x), obj2.speedVector.y + (impulse * obj1.mass * vCollisionNorm.y)));
            }
        }
    }
}

function detectEdgeCollisions(balls: Ball[], board: { w: number; h: number; x?: number; y?: number; }) {
    let obj;
    for (let i = 0; i < balls.length; i++)
    {
        obj = balls[i];

        // Check for left and right
        if (obj.x < obj.radius){
            obj.speedVector.x = Math.abs(obj.speedVector.x) * settings.bounceFriction;
            obj.x = obj.radius;
        }else if (obj.x > board.w - obj.radius){
            obj.speedVector.x = -Math.abs(obj.speedVector.x) * settings.bounceFriction;
            obj.x = board.w - obj.radius;
        }

        // Check for bottom and top
        if (obj.y < obj.radius){
            obj.speedVector.y = -(Math.abs(obj.speedVector.y) * settings.bounceFriction);
            obj.y = obj.radius;
        } else if (obj.y > board.h - obj.radius){
            obj.speedVector.y = -(-Math.abs(obj.speedVector.y) * settings.bounceFriction);
            obj.y = board.h - obj.radius;
        }
    }
}

function checkEnd(balls: Ball[]) {
    return;
    const filteredBalls = balls.filter(ball => !ball.isHidden && !ball.isPlayer);
    const color = filteredBalls[0].color;
    const isSingleColor = filteredBalls.every(ball => ball.color === color);
    if (isSingleColor) {
        console.log(balls[balls.length - 1])
        console.log(`Winner ${color} with ${filteredBalls.length} balls.`);
        // @ts-ignore
        window.nope = true;
    }
}

// @ts-ignore
function Board(props) {
    let nope = false;

    const { setInfo } = props;

    const [_info, setInternalInfo] = useState<string>('');
    const info = useRef<number>(0);
    const keys = useRef<{ArrowLeft: boolean; ArrowUp: boolean; ArrowRight: boolean; ArrowDown: boolean}>({
        ArrowUp: false,
        ArrowLeft: false,
        ArrowDown: false,
        ArrowRight: false,
    });

    const playerBall: Ball = new Ball(null, 150, 150, 0, 0).setPreferences(20, '#bf50e1');

    const [showCanvas, setShowCanvas] = useState<boolean>(false);
    const [ballsAmount, setBallsAmount] = useState<number>(30);

    const balls = useRef<Ball[]>([]);

    const draw = (ctx: Context, frameCount: number, secondsPassed: number) => {
        if (!balls.current.length) {
            for (let i = 0; i < ballsAmount; i++) {
                balls.current.push(new Ball(
                    ctx,
                    +Math.random().toFixed(2) * 100 + 200,
                    +Math.random().toFixed(2) * 100 + 200,
                    settings.ball.speed * (+Math.random().toFixed(2)) * (i % 2 ? 1 : -1),
                    settings.ball.speed * (+Math.random().toFixed(2)) * (i % 2 ? 1 : -1),
                ).setPreferences(settings.ball.radius)
                    .useColoredCollision(false));
            }
            for (let i = 0; i < ballsAmount; i++) {
                balls.current.push(new Ball(
                    ctx,
                    +Math.random().toFixed(2) * 100 + 400,
                    +Math.random().toFixed(2) * 100 + 200,
                    settings.ball.speed * (+Math.random().toFixed(2)) * (i % 2 ? 1 : -1),
                    settings.ball.speed * (+Math.random().toFixed(2)) * (i % 2 ? 1 : -1),
                ).setPreferences(settings.ball.radius, 'blue')
                    .useColoredCollision(false));
            }
            for (let i = 0; i < ballsAmount; i++) {
                balls.current.push(new Ball(
                    ctx,
                    +Math.random().toFixed(2) * 100 + 400,
                    +Math.random().toFixed(2) * 100 + 400,
                    settings.ball.speed * (+Math.random().toFixed(2)) * (i % 2 ? 1 : -1),
                    settings.ball.speed * (+Math.random().toFixed(2)) * (i % 2 ? 1 : -1),
                ).setPreferences(settings.ball.radius, 'green')
                    .useColoredCollision(false));
            }
            balls.current.push(...[
                playerBall.addContext(ctx).setPlayer()
                // new Ball(ctx, 350, 350, -2000, 2000).setPreferences(settings.ball.radius * 10, 'green'),
                // new Ball(ctx, 350, 250, -2000, 2000).setPreferences(settings.ball.radius * 10, 'green'),
                // new Ball(ctx, 350, 150, -2000, 2000).setPreferences(settings.ball.radius * 10, 'green'),
                // new Ball(ctx, 200, 200, 200, -200).setPreferences(settings.ball.radius, 'blue'),
                // new Ball(ctx, 400, 400, -200, 200).setPreferences(settings.ball.radius, 'yellow'),
                // new Ball(ctx, 350, 350, -200, 10).setPreferences(settings.ball.radius * 2, 'pink'),
            ]);
        }

        // @ts-ignore
        if (nope || window.nope) return;

        const board = {w: ctx.canvas.width, h: ctx.canvas.height, x: 0, y: 0};

        balls.current.forEach(ball => {
            ball.updatePosition(secondsPassed);
        });

        detectCollision(balls.current, setInfo, info);

        detectEdgeCollisions(balls.current, board);

        checkEnd(balls.current);

        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#00000055';
        ctx.beginPath();
        // ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI)
        ctx.rect(board.x, board.y, board.w, board.h);
        ctx.fill();
        // ctx.closePath()

        for (const ball of balls.current) {
            if (ball.isHidden) {
                continue;
            }
            ball.draw();
        }

        ctx.fillStyle = 'green'
        ctx.font = "30px Arial";
        // ctx.fillText(JSON.stringify(keys.current), 10, 400);
        // ctx.fillText(info.current.toString(), 10, 400);
        ctx.restore();
    }

    document.addEventListener('keydown', (event: any) => {
        if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            info.current = event.key;
            // @ts-ignore
            keys.current[event.key] = true;

            playerBall.moveObject(keys.current);
        }
    });

    document.addEventListener('keyup', (event: any) => {
        if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            info.current = event.key;
            // @ts-ignore
            keys.current[event.key] = false;

            playerBall.moveObject(keys.current);
        }
    });

    const onNope = () => {
        // @ts-ignore
        window.nope = !window.nope;
    }

    return (
        <div className="Board">
            <div>
                {showCanvas && <Canvas key={'cc'} draw={draw} width={settings.gameField.width} height={settings.gameField.height}/>}
            </div>
            <button onClick={onNope}>nope</button>
            {/*{JSON.stringify(keys.current)}*/}
            {info.current}
            {_info}
            {!showCanvas && <button onClick={() => setShowCanvas(true)}>Start</button>}
            {showCanvas && <button onClick={() => setShowCanvas(false)}>Reset</button>}
            {!showCanvas && <input value={ballsAmount} onChange={e => setBallsAmount(+e.target.value)} />}
        </div>
    );
}

export default React.memo(Board);
