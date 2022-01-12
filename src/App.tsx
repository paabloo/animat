import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from "./Canvas/Canvas";

// export type Context = { clearRect: (arg0: number, arg1: number, arg2: any, arg3: any) => void; canvas: { width: any; height: any; }; fillStyle: string; beginPath: () => void; arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void; fill: () => void; };

export type Context = CanvasRenderingContext2D;

function rectCircleColliding(circle: any, rect: any, collideInside: boolean) {
    // compute a center-to-center vector
    var half = { x: rect.w/2, y: rect.h/2 };
    var center = {
        x: circle.x - (rect.x+half.x),
        y: circle.y - (rect.y+half.y)};

    // check circle position inside the rectangle quadrant
    var side = {
        x: Math.abs (center.x) - half.x,
        y: Math.abs (center.y) - half.y};
    if (side.x >  circle.r || side.y >  circle.r) // outside
        return false;
    if (side.x < -circle.r && side.y < -circle.r) // inside
        return collideInside;
    if (side.x < 0 || side.y < 0) // intersects side or corner
        return true;

    // circle is near the corner
    return side.x*side.x + side.y*side.y  < circle.r*circle.r;
}

function bounces (rect: { w: number; h: number; x: number; y: number; }, circle: { x: number; y: number; r: number; })
{
    // compute a center-to-center vector
    var half = { x: rect.w/2, y: rect.h/2 };
    var center = {
        x: circle.x - (rect.x+half.x),
        y: circle.y - (rect.y+half.y)};

    // check circle position inside the rectangle quadrant
    var side = {
        x: Math.abs (center.x) - half.x,
        y: Math.abs (center.y) - half.y};
    if (side.x >  circle.r || side.y >  circle.r) // outside
        return { bounce: false };
    if (side.x < -circle.r && side.y < -circle.r) // inside
        return { bounce: false };
    if (side.x < 0 || side.y < 0) // intersects side or corner
    {
        var dx = 0, dy = 0;
        if (Math.abs (side.x) < circle.r && side.y < 0)
        {
            dx = center.x*side.x < 0 ? -1 : 1;
        }
        else if (Math.abs (side.y) < circle.r && side.x < 0)
        {
            dy = center.y*side.y < 0 ? -1 : 1;
        }

        return { bounce: true, x:dx, y:dy };
    }
    // circle is near the corner
    let bounce = side.x*side.x + side.y*side.y  < circle.r*circle.r;
    if (!bounce) return { bounce:false }
    var norm = Math.sqrt (side.x*side.x+side.y*side.y);
    var dx = center.x < 0 ? -1 : 1;
    var dy = center.y < 0 ? -1 : 1;
    return { bounce:true, x: dx*side.x/norm, y: dy*side.y/norm };
}

function App() {
    let oldX: number | null = null;
    let newX: number = 51;
    let dir = 1.5;

    const draw = (ctx: Context, frameCount: number) => {
        // clock(ctx);
        // return;
        // const animationSpeed = frameCount * 1.5;
        if (oldX === null) {
            oldX = 50;
        }
        const board = {w: ctx.canvas.width, h: ctx.canvas.height, x: 0, y: 0};
        const ball = {x: newX, y: 55, r: 50, s: 0, e: Math.PI * 2};

        const asd = rectCircleColliding(ball, board, false);
        const b = bounces(board, ball);
        if (b.bounce) {
            // console.log(b);
            // debugger;
        }

        // debugger;
        if (bounces(board, {...ball, x: newX + dir}).bounce) {
            dir *= -1;
        }
        newX += dir;
        // if (b.bounce) {
        //     newX = oldX;
        //     ball.x = oldX || 0;
        // } else {
        //     oldX = ball.x;
        // }
        // animationSpeed % (300 - 100) + 50
        ctx.clearRect(board.x, board.y, board.w, board.h);
        ctx.fillStyle = '#00000055';
        ctx.beginPath();
        // ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI)
        ctx.rect(board.x, board.y, board.w, board.h);
        ctx.fill();
        // ctx.closePath()

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, ball.s, ball.e);
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillText(asd.toString(), 10, 200);

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

    document.addEventListener('keydown', (event: any) => {
        if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.key)) {
            event.preventDefault()
            switch (event.key) {
                case 'ArrowLeft':
                    newX--;
                    break;
                case 'ArrowRight':
                    newX++;
                    break;
            }
        }
        console.log(event.key)
    });

    return (
        <div className="App">
            {/*<header className="App-header">*/}
            {/*  <img src={logo} className="App-logo" alt="logo" />*/}
            {/*  <p>*/}
            {/*    Edit <code>src/App.tsx</code> and save to reload.*/}
            {/*  </p>*/}
            {/*  <a*/}
            {/*    className="App-link"*/}
            {/*    href="https://reactjs.org"*/}
            {/*    target="_blank"*/}
            {/*    rel="noopener noreferrer"*/}
            {/*  >*/}
            {/*    Learn React*/}
            {/*  </a>*/}
            {/*</header>*/}
            <div>
                <Canvas draw={draw} width={300} height={300} />
            </div>
        </div>
    );
}

export default App;


function clock(ctx: any) {
    var now = new Date();
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
    for (var i = 0; i < 12; i++) {
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
    for (i = 0; i < 60; i++) {
        if (i % 5!= 0) {
            ctx.beginPath();
            ctx.moveTo(117, 0);
            ctx.lineTo(120, 0);
            ctx.stroke();
        }
        ctx.rotate(Math.PI / 30);
    }
    ctx.restore();

    var sec = now.getSeconds();
    var min = now.getMinutes();
    var hr  = now.getHours();
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