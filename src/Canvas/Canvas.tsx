import React, { useRef, useEffect } from 'react'

const Canvas = (props: { [x: string]: any; draw: any }) => {

    const { draw, ...rest } = props
    const canvasRef = useRef(null)

    useEffect(() => {

        const canvas = canvasRef.current
        // @ts-ignore
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId: number;

        const render = () => {
            frameCount++;
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render);
        }
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw]);

    return <canvas ref={canvasRef} {...rest} style={{ height: rest.height, width: rest.width }} />
}

export default Canvas
