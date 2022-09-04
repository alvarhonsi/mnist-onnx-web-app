import { useRef, useEffect, useState } from 'react'

const useCanvas = (size, canvas_scale) => {
  
  const canvasRef = useRef(null)

  const [isMouseDown, setIsMouseDown] = useState(false)
  const [hasIntroText, setHasIntroText] = useState(true)
  const [prevCoord, setPrevCoord] = useState([0, 0])
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.lineWidth = 28;
    context.lineJoin = "round";
    context.font = "28px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.strokeStyle = "#212121";
    context.fillStyle = "black";

    const clearCanvas = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    const drawLine = (ctx, fromX, fromY, toX, toY) => {
        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        ctx.stroke()
    }

    const canvasMouseDown = (ctx, event) => {
        setIsMouseDown(true)
        if (hasIntroText) {
          clearCanvas(ctx)
          setHasIntroText(false)
        }
    
        const x = event.offsetX / canvas_scale;
        const y = event.offsetY / canvas_scale;
    
        setPrevCoord([x + 0.001, y + 0.001]) //canvas trickery for å få dot på canvas når man klikker
        canvasMouseMove(ctx, event)
    } 

    const canvasMouseMove = (ctx, event) => {
        const x = event.offsetX / canvas_scale;
        const y = event.offsetY / canvas_scale;

        if (isMouseDown) {
            drawLine(ctx, prevCoord[0], prevCoord[1], x, y)
        }
        setPrevCoord([x, y])
    }

    const bodyMouseUp = () => {
        setIsMouseDown(false)
    }

    const bodyMouseOut = (event) => {
        if (!event.relatedTarget || event.relatedTarget.nodeName === "HTML") {
            setIsMouseDown(false)
        }
    }

    canvas.addEventListener('mousedown', e => {
        canvasMouseDown(context, e)})
    canvas.addEventListener('mousemove', e => canvasMouseMove(context, e))
    document.body.addEventListener("mouseup", bodyMouseUp)
    document.body.addEventListener("mouseout", bodyMouseOut)
  }, [size, canvas_scale, hasIntroText, isMouseDown, prevCoord])
  
  return canvasRef
}

export default useCanvas