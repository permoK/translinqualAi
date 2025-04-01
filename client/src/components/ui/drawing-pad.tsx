import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Eraser, Undo, Pen } from "lucide-react";

interface DrawingPadProps {
  onSave: (imageData: string) => void;
  onClose: () => void;
}

export function DrawingPad({ onSave, onClose }: DrawingPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [drawingMode, setDrawingMode] = useState<"pen" | "eraser">("pen");
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });

  // Setup canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set initial canvas state
    ctx.fillStyle = "#f9fafb"; // Light gray background (matches bg-gray-50)
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state for undo
    const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack([initialState]);
    
    // Setup event listeners for touch events
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      startDrawing(x, y);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      draw(x, y);
    };
    
    const handleTouchEnd = () => {
      endDrawing();
    };
    
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Helper function to save current state to undo stack
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, currentState]);
  };

  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    setIsDrawing(true);
    lastPos.current = { x, y };
    
    // Setup context based on mode
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    if (drawingMode === "pen") {
      ctx.strokeStyle = color;
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.strokeStyle = "#f9fafb"; // Match canvas background
      ctx.globalCompositeOperation = "destination-out";
    }
    
    // Start a new path
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPos.current = { x, y };
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    saveState();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    draw(x, y);
  };

  const handleMouseUp = () => {
    endDrawing();
  };

  const handleMouseLeave = () => {
    endDrawing();
  };

  const handleUndo = () => {
    if (undoStack.length <= 1) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Remove the last state (current state)
    setUndoStack(prev => {
      const newStack = [...prev];
      newStack.pop();
      
      // Apply the previous state
      if (newStack.length > 0) {
        const previousState = newStack[newStack.length - 1];
        ctx.putImageData(previousState, 0, 0);
      }
      
      return newStack;
    });
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#f9fafb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const imageData = canvas.toDataURL("image/png");
    onSave(imageData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-2 mb-3">
      <canvas
        ref={canvasRef}
        className="bg-gray-50 dark:bg-gray-900 h-40 w-full rounded-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <div className="flex justify-between mt-2">
        <div className="flex space-x-2">
          <Button
            variant={drawingMode === "pen" ? "default" : "outline"}
            size="icon"
            onClick={() => setDrawingMode("pen")}
            className="w-8 h-8"
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant={drawingMode === "eraser" ? "default" : "outline"}
            size="icon"
            onClick={() => setDrawingMode("eraser")}
            className="w-8 h-8"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleUndo}
            disabled={undoStack.length <= 1}
            className="w-8 h-8"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClear}
            className="w-8 h-8 text-red-500 hover:text-red-600"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSave}>
            Recognize
          </Button>
        </div>
      </div>
    </div>
  );
}
