import React, { useRef, useState } from 'react';
import Victor from 'victor';
import './App.css';
import Canvas from "./Canvas/Canvas";
import settings from './settings';
import { Ball } from './Ball';

console.log(settings);
// @ts-ignore
window.v = Victor;

export type Context = CanvasRenderingContext2D;

function detectCollision(balls: Ball[]): void {
    balls.forEach(ball => ball.setCollision(false));

    let obj1;
    let obj2;

    for (let i = 0; i < balls.length; i++) {
        obj1 = balls[i];
        for (let j = i + 1; j < balls.length; j++) {
            obj2 = balls[j];

            const vectorBall = new Victor(obj1.x, obj1.y);
            const vectorOtherBall = new Victor(obj2.x, obj2.y);
            let distance = vectorBall.distance(vectorOtherBall);
            let bounce = distance <= obj1.radius + obj2.radius;

            if (bounce) {
                obj1.setCollision(true);
                obj2.setCollision(true);

                let vCollision = {x: obj2.x - obj1.x, y: -obj2.y - (-obj1.y)};
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.speedVector.x - obj2.speedVector.x, y: obj1.speedVector.y - obj2.speedVector.y};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                speed *= settings.friction;
                obj1.x -= vCollisionNorm.x;
                obj1.y += vCollisionNorm.y;

                obj2.x += vCollisionNorm.x;
                obj2.y -= vCollisionNorm.y;
                debugger;

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
            obj.speedVector.x = Math.abs(obj.speedVector.x) * settings.friction;
            obj.x = obj.radius;
        }else if (obj.x > board.w - obj.radius){
            obj.speedVector.x = -Math.abs(obj.speedVector.x) * settings.friction;
            obj.x = board.w - obj.radius;
        }

        // Check for bottom and top
        if (obj.y < obj.radius){
            obj.speedVector.y = -(Math.abs(obj.speedVector.y) * settings.friction);
            obj.y = obj.radius;
        } else if (obj.y > board.h - obj.radius){
            obj.speedVector.y = -(-Math.abs(obj.speedVector.y) * settings.friction);
            obj.y = board.h - obj.radius;
        }
    }
}

function App() {
    let nope = false;

    const [info, setInfo] = useState<string>('');
    const [showCanvas, setShowCanvas] = useState<boolean>(false);
    const [ballsAmount, setBallsAmount] = useState<number>(30);

    const balls: Ball[] = [];

    const draw = (ctx: Context, frameCount: number, secondsPassed: number) => {
        if (!balls.length) {
            for (let i = 0; i < ballsAmount; i++) {
                balls.push(new Ball(
                    ctx,
                    +Math.random().toFixed(2) * 100 + 200,
                    +Math.random().toFixed(2) * 100 + 200,
                    settings.ball.speed * (+Math.random().toFixed(2)) * (i % 2 ? 1 : -1),
                    settings.ball.speed * (+Math.random().toFixed(2)) * (i % 2 ? 1 : -1),
                ).setPreferences(settings.ball.radius)
                .useColoredCollision(true));
            }
            balls.push(...[
                // new Ball(ctx, 350, 350, -200, 2000).setPreferences(settings.ball.radius * 4, 'green'),
                // new Ball(ctx, 200, 200, 200, -200).setPreferences(settings.ball.radius, 'blue'),
                // new Ball(ctx, 400, 400, -200, 200).setPreferences(settings.ball.radius, 'yellow'),
                // new Ball(ctx, 350, 350, -200, 10).setPreferences(settings.ball.radius * 2, 'pink'),
            ]);
        }

        // @ts-ignore
        if (nope || window.nope) return;

        const board = {w: ctx.canvas.width, h: ctx.canvas.height, x: 0, y: 0};

        balls.forEach(ball => {
            ball.updatePosition(secondsPassed);
        });

        detectCollision(balls);

        detectEdgeCollisions(balls, board);

        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#00000055';
        ctx.beginPath();
        // ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI)
        ctx.rect(board.x, board.y, board.w, board.h);
        ctx.fill();
        // ctx.closePath()

        for (const ball of balls) {
            if (ball.isHidden) {
                continue;
            }
            ball.draw(true);
        }

        ctx.fillStyle = 'green'
        ctx.font = "30px Arial";
        ctx.fillText('txt', 10, 400);
        ctx.restore();
    }

    // document.addEventListener('keydown', (event: any) => {
    //     if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.key)) {
    //         event.preventDefault()
    //         switch (event.key) {
    //             case 'ArrowLeft':
    //                 newX--;
    //                 break;
    //             case 'ArrowRight':
    //                 newX++;
    //                 break;
    //         }
    //     }
    //     console.log(event.key)
    // });

    const onNope = () => {
        // @ts-ignore
        window.nope = !window.nope;
    }

    // setTimeout(() => {
    //     setInfo(info === 'done' ? 'srone' : 'done');
    // }, 1000)

    return (
        <div className="App">
            <div>
                {showCanvas && <Canvas key={'cc'} draw={draw} width={settings.gameField.width} height={settings.gameField.height}/>}
            </div>
            <button onClick={onNope}>nope</button>
            {info}
            {!showCanvas && <button onClick={() => setShowCanvas(true)}>Start</button>}
            {showCanvas && <button onClick={() => setShowCanvas(false)}>Reset</button>}
            {!showCanvas && <input value={ballsAmount} onChange={e => setBallsAmount(+e.target.value)} />}
        </div>
    );
}

export default App;


function clock(ctx: any) {
    const now = new Date();
    ctx.save();
    ctx.clearRect(0, 0, 150, 150);
    ctx.translate(75, 75);
    ctx.scale(0.4, 0.4);
    ctx.rotate(-Math.PI / 2);
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    // Hour marks
    ctx.save();
    for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.rotate(Math.PI / 6);
        ctx.moveTo(100, 0);
        ctx.lineTo(120, 0);
        ctx.stroke();
    }
    ctx.restore();

    // Minute marks
    ctx.save();
    ctx.lineWidth = 5;
    for (let i = 0; i < 60; i++) {
        if (i % 5!= 0) {
            ctx.beginPath();
            ctx.moveTo(117, 0);
            ctx.lineTo(120, 0);
            ctx.stroke();
        }
        ctx.rotate(Math.PI / 30);
    }
    ctx.restore();

    const sec = now.getSeconds();
    const min = now.getMinutes();
    let hr  = now.getHours();
    hr = hr >= 12 ? hr - 12 : hr;

    ctx.fillStyle = 'black';

    // write Hours
    ctx.save();
    ctx.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) *sec);
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(80, 0);
    ctx.stroke();
    ctx.restore();

    // write Minutes
    ctx.save();
    ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-28, 0);
    ctx.lineTo(112, 0);
    ctx.stroke();
    ctx.restore();

    // Write seconds
    ctx.save();
    ctx.rotate(sec * Math.PI / 30);
    ctx.strokeStyle = '#D40000';
    ctx.fillStyle = '#D40000';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(83, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#325FA2';
    ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
    ctx.stroke();

    ctx.restore();
}
