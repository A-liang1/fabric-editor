import React, { useRef, useEffect } from 'react';
import { useEditor } from '../context';
import { FabricCanvas } from '../core/FabricCanvas';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const { setFabricCanvas } = useEditor();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (!canvasRef.current) {
      return;
    }

    try {
      const fabricCanvas = new FabricCanvas(canvasRef.current);
      fabricCanvasRef.current = fabricCanvas;
      setFabricCanvas(fabricCanvas);
    } catch (error) {
      console.error('[Canvas] Error:', error);
    }
  }, [setFabricCanvas]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <canvas ref={canvasRef} width="800" height="600" style={styles.canvas} />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    padding: '16px',
    minWidth: 0,
    minHeight: 0,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  canvas: {
    display: 'block',
    borderRadius: '8px',
  },
};
