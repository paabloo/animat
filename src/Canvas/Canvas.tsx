import React, { useRef, useEffect } from 'react'

const Canvas = (props: { [x: string]: any; draw: any }) => {

    const { draw, ...rest } = props
    const canvasRef = useRef(null)
    const oldTimeStamp = useRef<number>(-1);

    useEffect(() => {

        const canvas = canvasRef.current
        // @ts-ignore
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId: number;

        const render = (timestamp: number) => {
            if (oldTimeStamp.current === -1) {
                oldTimeStamp.current = timestamp;
            }
            const secondsPassed = (timestamp - oldTimeStamp.current) / 1000;
            oldTimeStamp.current = timestamp;
            frameCount++;
            draw(context, frameCount, secondsPassed)
            animationFrameId = window.requestAnimationFrame(ts => render(ts));
        }
        render(oldTimeStamp.current);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw]);

    return <canvas ref={canvasRef} {...rest} style={{ height: rest.height, width: rest.width }} />
}

export default React.memo(Canvas);
