import React, { useRef, useState } from 'react';
import Victor from 'victor';
import './App.css';
import Canvas from "./Canvas/Canvas";
import settings from './settings';
import { Ball } from './Ball';

// export type Context = { clearRect: (arg0: number, arg1: number, arg2: any, arg3: any) => void; canvas: { width: any; height: any; }; fillStyle: string; beginPath: () => void; arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void; fill: () => void; };

console.log(settings);
// @ts-ignore
window.v = Victor;

export type Context = CanvasRenderingContext2D;

// interface Ball {
//     id: number,
//     x: number,
//     y: number,
//     r: number,
//     s: number,
//     e: number,
//     fillStyle: string,
//     speedVector: Victor,
// }

// function rectCircleColliding(circle: any, rect: any, collideInside: boolean) {
//     // compute a center-to-center vector
//     const half = { x: rect.w/2, y: rect.h/2 };
//     const center = {
//         x: circle.x - (rect.x+half.x),
//         y: circle.y - (rect.y+half.y)};
//
//     // check circle position inside the rectangle quadrant
//     const side = {
//         x: Math.abs (center.x) - half.x,
//         y: Math.abs (center.y) - half.y};
//     if (side.x >  circle.r || side.y >  circle.r) // outside
//         return false;
//     if (side.x < -circle.r && side.y < -circle.r) // inside
//         return collideInside;
//     if (side.x < 0 || side.y < 0) // intersects side or corner
//         return true;
//
//     // circle is near the corner
//     return side.x*side.x + side.y*side.y  < circle.r*circle.r;
// }

function bounceFromBall(balls: Ball[]): { bounce: boolean, distance: number, newVector: Victor } {
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
                let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (-obj2.y-(-obj1.y))*(-obj2.y-(-obj1.y)));
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.speedVector.x - obj2.speedVector.x, y: obj1.speedVector.y - obj2.speedVector.y};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                if (speed < 0) {
                    continue;
                }

                let impulse = 2 * speed / (obj1.mass + obj2.mass);
                // let impulse = 1;
                obj1.setSpeedVector(new Victor(obj1.speedVector.x - (impulse * obj2.mass * vCollisionNorm.x), obj1.speedVector.y - (impulse * obj2.mass * vCollisionNorm.y)));
                obj2.setSpeedVector(new Victor(obj2.speedVector.x + (impulse * obj1.mass * vCollisionNorm.x), obj2.speedVector.y + (impulse * obj1.mass * vCollisionNorm.y)));

                // obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                // obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                // obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                // obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);
            }
        }
    }

    let bounce: boolean = false;
    let distance: number = 0;
    let newVector: Victor = new Victor(0, 0);
    // if (ball.id !== 1) return { bounce, distance, newVector };
    balls.forEach(otherBall => {
        // if (ball.id === otherBall.id) return;
        // const vectorBall = new Victor(ball.x, ball.y);
        // const vectorOtherBall = new Victor(otherBall.x, otherBall.y);
        // distance = vectorBall.distance(vectorOtherBall);
        // bounce = distance <= ball.radius + otherBall.radius + 1;
        if (bounce) {

            // const vCollision = new Victor(otherBall.x - ball.x, otherBall.y - ball.y);
            // const vCollisionNorm = new Victor(vCollision.x / distance, vCollision.y / distance);
            // const vRelativeVelocity = new Victor(ball.speedVector.x - otherBall.speedVector.x, ball.speedVector.y - otherBall.speedVector.y);
            // let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
            // newVector = new Victor(Math.abs(otherBall.x - ball.x), Math.abs(otherBall.y - ball.y));
            //
            // ball.speedVector = new Victor(ball.speedVector.x - speed * vCollisionNorm.x, ball.speedVector.y + speed * vCollisionNorm.y);
            // otherBall.speedVector = new Victor(otherBall.speedVector.x - speed * vCollisionNorm.x, otherBall.speedVector.y + speed * vCollisionNorm.y)
            // // newVector = ball.speedVector
            // //     .clone()
            // //     .add(new Victor(Math.abs(ball.x - otherBall.x), Math.abs(ball.y - otherBall.y)).rotateDeg(-90));
            //
            // debugger;
            // // @ts-ignore
            // // window.nope = true;
        }
    });
    return { bounce, distance, newVector: newVector };
}

function bouncesFromBoard (circle: Ball, rect: { w: number; h: number; x: number; y: number; }, ): { bounce: boolean, x: number, y: number} {
    // compute a center-to-center vector
    const half = { x: rect.w/2, y: rect.h/2 };
    const center = {
        x: circle.x - (rect.x+half.x),
        y: circle.y - (rect.y+half.y)};

    // check circle position inside the rectangle quadrant
    const side = {
        x: Math.abs (center.x) - half.x,
        y: Math.abs (center.y) - half.y};
    if (side.x >  circle.radius || side.y >  circle.radius) // outside
        return { bounce: false, x: 0, y: 0 };
    if (side.x < -circle.radius && side.y < -circle.radius) // inside
        return { bounce: false, x: 0, y: 0 };
    if (side.x < 0 || side.y < 0) // intersects side or corner
    {
        let dx = 0, dy = 0;
        if (Math.abs (side.x) < circle.radius && side.y < 0)
        {
            dx = center.x*side.x < 0 ? -1 : 1;
        }
        else if (Math.abs (side.y) < circle.radius && side.x < 0)
        {
            dy = center.y*side.y < 0 ? -1 : 1;
        }

        return { bounce: true, x:dx, y:dy };
    }
    // circle is near the corner
    let bounce = side.x * side.x + side.y * side.y  < circle.radius * circle.radius;
    if (!bounce) return { bounce:false, x: 0, y: 0 };
    const norm = Math.sqrt (side.x*side.x+side.y*side.y);
    const dx = center.x < 0 ? -1 : 1;
    const dy = center.y < 0 ? -1 : 1;
    return { bounce:true, x: dx*side.x/norm, y: dy*side.y/norm };
}

function App() {
    let info = '';
    let nope = false;

    const balls: Ball[] = [];

    const draw = (ctx: Context, frameCount: number) => {
        if (!balls.length) {
            for (let i = 0; i < 30; i++) {
                balls.push(new Ball(
                    ctx,
                    +Math.random().toFixed(2) * 100 + 40,
                    +Math.random().toFixed(2) * 100 + 40,
                    +Math.random().toFixed(2) * 100,
                    +Math.random().toFixed(2) * 100
                ).setPreferences(settings.ball.radius));
            }
            // balls.push(...[
            //     new Ball(ctx, 150, 250, 100, 100).setPreferences(settings.ball.radius * 3, 'green'),
            //     new Ball(ctx, 202, 44, 10, -160).setPreferences(settings.ball.radius, 'blue'),
            //     new Ball(ctx, 123, 124, -100, -100).setPreferences(settings.ball.radius, 'yellow'),
            //     new Ball(ctx, 150, 150, -200, 10).setPreferences(settings.ball.radius * 2, 'pink'),
            // ]);
        }
        // @ts-ignore
        if (nope || window.nope) return;
        // clock(ctx);
        // return;
        // const animationSpeed = frameCount * 1.5;

        const board = {w: ctx.canvas.width - 300, h: ctx.canvas.height - 300, x: 0, y: 0};

        balls.forEach(ball => {
            ball.updatePosition();
        });

        bounceFromBall(balls);

        balls.forEach(ball => {
            const boardBounce = bouncesFromBoard(ball, board);
            if (boardBounce.bounce) {
                let deg = 0;
                if (boardBounce.x !== 0) {
                    deg = (ball.speedVector.verticalAngleDeg()) * 2;
                } else if (boardBounce.y !== 0) {
                    deg = (-ball.speedVector.horizontalAngleDeg()) * 2;
                }
                ball.speedVector.rotateDeg(deg);
            }
        })
        // balls.forEach(ball => {
            // const boardBounce = bouncesFromBoard(ball, board);
            // const ballBounce = bounceFromBall(ball, balls);
            // info = ballBounce.bounce.toString() + ' ' + ballBounce.distance.toString();
            //
            // if (ball.y + ball.r < board.h - 0.1) {
            //     ball.speedVector.addY(new Victor(0, settings.gravityVector.y / settings.framesPerSecond));
            // }
            //
            // if (boardBounce.bounce) {
            //     let deg = 0;
            //     if (boardBounce.x !== 0) {
            //         deg = (ball.speedVector.verticalAngleDeg()) * 2;
            //     } else if (boardBounce.y !== 0) {
            //         deg = (-ball.speedVector.horizontalAngleDeg()) * 2;
            //     }
            //     ball.speedVector.rotateDeg(deg);
            // }
            //
            // const frictionVector = ball.speedVector
            //     .clone()
            //     .invert()
            //     .multiply(new Victor((settings.friction / settings.framesPerSecond), (settings.friction / settings.framesPerSecond)));
            //
            // ball.speedVector.add(frictionVector);
            // if ((ball.speedVector.x < 0.1 && ball.speedVector.x > 0) || (ball.speedVector.x > -0.1 && ball.speedVector.x < 0)) {
            //     ball.speedVector.multiplyX(new Victor(0, 0));
            // }
            // if ((ball.speedVector.y < 0.1 && ball.speedVector.y > 0) || (ball.speedVector.y > -0.1 && ball.speedVector.y < 0)) {
            //     ball.speedVector.multiplyY(new Victor(0, 0));
            // }
        // });

        // info = balls.every(b => b.speedVector.x === 0 && b.speedVector.y === 0) ? 'done' : 'moving';

        // debugger;
        // if (bounces(board, {...ball, x: newX + dir}).bounce) {
        //     dir *= -1;
        // }
        // newX += dir;

        // if (b.bounce) {
        //     newX = oldX;
        //     ball.x = oldX || 0;
        // } else {
        //     oldX = ball.x;
        // }
        // animationSpeed % (300 - 100) + 50

        ctx.save();
        ctx.clearRect(board.x, board.y, board.w + 300, board.h + 300);
        ctx.fillStyle = '#00000055';
        ctx.beginPath();
        // ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI)
        ctx.rect(board.x, board.y, board.w, board.h);
        ctx.fill();
        // ctx.closePath()

        for (const ball of balls) {
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, ball.s, ball.e);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(ball.x + ball.speedVector.x, ball.y + (-ball.speedVector.y));
            ctx.stroke();
        }

        ctx.fillStyle = 'green'
        ctx.font = "30px Arial";
        ctx.fillText(info, 10, 400);

        ctx.restore();

        // ctx.closePath()

        // ctx.beginPath();
        // ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
        // ctx.moveTo(110,75);
        // ctx.arc(75,75,35,0,Math.PI,false);  // Mouth (clockwise)
        // ctx.moveTo(65,65);
        // ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
        // ctx.moveTo(95,65);
        // ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
        // ctx.stroke();
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

    return (
        <div className="App">
            <div>
                <Canvas draw={draw} width={600} height={600} />
            </div>
            <button onClick={onNope}>nope</button>
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
