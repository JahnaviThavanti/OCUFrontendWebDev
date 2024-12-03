import React, { useRef, useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const pointers = useRef([]); // Keep track of active pointers
  const [scale, setScale] = useState(1); // Scale for zoom
  const [origin, setOrigin] = useState({ x: 0, y: 0 }); // Origin for panning

  // Brush settings
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("#000000");
  const [lineOpacity, setLineOpacity] = useState(1);

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, [lineColor, lineOpacity, lineWidth]);

  // Handle pointer down (start drawing)
  const startDrawing = (e) => {
    pointers.current.push(e.pointerId);
    if (pointers.current.length === 1) {
      const ctx = ctxRef.current;
      const rect = canvasRef.current.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(
        (e.clientX - rect.left - origin.x) / scale,
        (e.clientY - rect.top - origin.y) / scale
      );
      setIsDrawing(true);
    }
  };

  // Handle pointer move (draw)
  const draw = (e) => {
    if (!isDrawing) return;

    const ctx = ctxRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    const pressure = e.pressure > 0 ? e.pressure : 1; // Use pressure if available
    ctx.lineWidth = lineWidth * pressure;
    ctx.lineTo(
      (e.clientX - rect.left - origin.x) / scale,
      (e.clientY - rect.top - origin.y) / scale
    );
    ctx.stroke();
  };

  // Handle pointer up (stop drawing)
  const endDrawing = (e) => {
    pointers.current = pointers.current.filter((id) => id !== e.pointerId);
    if (pointers.current.length === 0) {
      const ctx = ctxRef.current;
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  // Handle pinch-to-zoom
  const handleGesture = (e) => {
    if (pointers.current.length === 2) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const pointer1 = e.getCoalescedEvents()[0];
      const pointer2 = e.getCoalescedEvents()[1];

      const currentDistance = Math.hypot(
        pointer2.clientX - pointer1.clientX,
        pointer2.clientY - pointer1.clientY
      );

      if (!e.previousDistance) {
        e.previousDistance = currentDistance;
      }

      const zoomFactor = currentDistance / e.previousDistance;
      setScale((prevScale) => Math.max(0.1, prevScale * zoomFactor));
      e.previousDistance = currentDistance;
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">React Paint App with Pressure & Zoom</h1>
      <div className="canvas-container">
        <div className="brush-settings">
          <label>
            Color:
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
            />
          </label>
          <label>
            Width:
            <input
              type="number"
              min="1"
              max="50"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Opacity:
            <input
              type="range"
              min="1"
              max="100"
              value={lineOpacity * 100}
              onChange={(e) => setLineOpacity(e.target.value / 100)}
            />
          </label>
        </div>
        <canvas
          ref={canvasRef}
          className="paint-canvas"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerCancel={endDrawing}
          onPointerOut={endDrawing}
          onPointerLeave={endDrawing}
        ></canvas>
      </div>
    </div>
  );
};

export default App;
