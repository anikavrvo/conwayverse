/**
 * Grid Renderer Component
 * Renders the cellular automaton grid using Canvas for performance
 */

import React, { useEffect, useRef } from 'react';
import { Grid } from '../engine';
import './GridRenderer.css';

interface GridRendererProps {
  grid: Grid;
  cellSize?: number;
  colorMap?: (state: number) => string;
  onCellClick?: (coords: [number, number]) => void;
  showGrid?: boolean;
  maxRenderSize?: number;
}

const defaultColorMap = (state: number): string => {
  if (state === 0) return '#ffffff';
  // Gradient from blue to red based on state value
  const hue = 240 - (state / 255) * 240;
  return `hsl(${hue}, 100%, 50%)`;
};

export const GridRenderer: React.FC<GridRendererProps> = ({
  grid,
  cellSize = 10,
  colorMap = defaultColorMap,
  onCellClick,
  showGrid = true,
  maxRenderSize = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizes = grid.getSizes();
  const dimensions = grid.getDimensions();

  // For 3D grids, we'll render a slice
  const renderWidth = dimensions === 2 ? sizes[0] : Math.min(sizes[0], maxRenderSize);
  const renderHeight = dimensions === 2 ? sizes[1] : Math.min(sizes[1], maxRenderSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const width = renderWidth * cellSize;
    const height = renderHeight * cellSize;
    canvas.width = width;
    canvas.height = height;

    // Draw grid background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= renderWidth; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, height);
        ctx.stroke();
      }
      for (let i = 0; i <= renderHeight; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(width, i * cellSize);
        ctx.stroke();
      }
    }

    // Draw cells
    for (let x = 0; x < renderWidth; x++) {
      for (let y = 0; y < renderHeight; y++) {
        const coords = dimensions === 2 ? [x, y] : [x, y, 0];
        const state = grid.getCell(coords);

        if (state !== 0) {
          ctx.fillStyle = colorMap(state);
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [grid, cellSize, colorMap, showGrid, renderWidth, renderHeight, dimensions]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onCellClick || dimensions !== 2) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x >= 0 && x < renderWidth && y >= 0 && y < renderHeight) {
      onCellClick([x, y]);
    }
  };

  return (
    <div className="grid-renderer">
      <canvas
        ref={canvasRef}
        className="grid-canvas"
        onClick={handleCanvasClick}
        style={{ cursor: onCellClick ? 'crosshair' : 'default' }}
      />
    </div>
  );
};
