import { InferenceSession, Tensor } from 'onnxjs';
import React, { useRef, useLayoutEffect, useCallback, useState, useEffect } from "react";
import {
	warmupModel,
	getTensorFromCanvasContext,
	setContextFromTensor,
	tensorToCanvas,
	canvasToTensor
} from "./onnx/utils";
import { useCanvas } from './hooks/CanvasContext'

import logo from './logo.svg';
import './App.css';
import BarGraph from './components/BarGraph';

let inferenceSession;

const MODEL_URL = "./models/mnist_model.onnx";
const CANVAS_SIZE = 28;
const CANVAS_SCALE = 0.5;

const loadModel = async () => {
	inferenceSession = await new InferenceSession();
	inferenceSession.loadModel(MODEL_URL).then(async () => {
    //await warmupModel(inferenceSession, [1, 1, CANVAS_SIZE, CANVAS_SIZE])
  });
	;
};


function App() {
  const [guess, setGuess] = useState(0)
  const [pred, setPred] = useState([0,0,0,0,0,0,0,0,0,0])
  const [img, setImg] = useState(null)

  const {
    canvasRef,
    prepareCanvas,
    startDrawing,
    finishDrawing,
    draw,
  } = useCanvas();

  useEffect(() => {
    prepareCanvas(420, 420);
  }, []);

  useLayoutEffect(() => {
		const init = async () => {
			await loadModel();
		};
		init();
	}, []);

  useEffect(() => {
    if (img) {
      updatePrediction()
    }
  }, [img])

  const updatePrediction = async () => {
    const test = new Tensor(new Float32Array(420*420*4), "float32")

    const inputTensor = new Tensor(new Float32Array(img), "float32")
    const outputMap = await inferenceSession.run([inputTensor])
    const outputTensor = outputMap.values().next().value
    const predictions = outputTensor.data;

    setPred(Array.from(predictions))
    const guess = predictions.indexOf(Math.max(...predictions));
    setGuess(guess)
  }

  const clearCanvas = () => {
    if(canvasRef){
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      setPred([0,0,0,0,0,0,0,0,0,0])
      setImg(null)
    }
  }

  return (
    <div className="App">
      <div className='flex flex-row justify-center p-4'>
        <div className='flex flex-col p-4 bg-white drop-shadow-lg'>
          <h1>Mnist Model</h1>
          <div className='border-2'>
            <canvas
              onMouseDown={e => {startDrawing(e)
                const ctx = canvasRef.current.getContext("2d")
                const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data
                setImg(img)
              }}
              onMouseUp={e => {finishDrawing(e)
                const ctx = canvasRef.current.getContext("2d")
                const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data
                setImg(img)
              }}
              onMouseMove={e => {draw(e)
                if (img) {
                  const ctx = canvasRef.current.getContext("2d")
                  const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data
                  setImg(img)
                }
              }
              }
              ref={canvasRef}
            />
          </div>
          <div className='flex flex-row justify-center p-2'>
            <button onClick={clearCanvas} className='w-32 px-auto bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-slate-300 rounded shadow'>Clear</button>
          </div>
          <div className='flex flex-row justify-around p-2 h-32 drop-shadow-md'>
              {pred.map((p, idx) => (
                <BarGraph key={idx} num={idx} fillPercent={p} highlight={idx === guess} height={32} width={6}/>)
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
