/**
 * Simulator Container Component
 * Main orchestrator for the ConwayVerse simulation interface
 */

import React, { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  Simulation,
  PresetConfigs,
  Grid,
  type SimulationConfig
} from '../engine';
import { GridRenderer } from './GridRenderer';
import { SimulationControls } from './SimulationControls';
import { ConfigPanel } from './ConfigPanel';
import './SimulatorContainer.css';

export const SimulatorContainer: React.FC = () => {
  // State management
  const [config, setConfig] = useState<SimulationConfig>(
    PresetConfigs.conwayGameOfLife2D(50)
  );
  const [simulation, setSimulation] = useState<Simulation>(
    new Simulation(config)
  );
  const [grid, setGrid] = useState<Grid>(simulation.getGrid());
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(10); // generations per second
  const [cellSize, setCellSize] = useState(10);
  const [editMode, setEditMode] = useState(false);
  const [editState, setEditState] = useState(1);

  const animationRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);

  // Handle configuration changes
  const handleConfigChange = useCallback((newConfig: SimulationConfig) => {
    setConfig(newConfig);
    const newSimulation = new Simulation(newConfig);
    setSimulation(newSimulation);
    setGrid(newSimulation.getGrid());
    setGeneration(0);
    setIsRunning(false);
  }, []);

  // Handle pattern application
  const handlePatternApply = useCallback(
    (cells: Array<[number, number]>) => {
      const newGrid = grid.clone();
      for (const [x, y] of cells) {
        newGrid.setCell([x, y], editState);
      }
      setGrid(newGrid);
      simulation.setGrid(newGrid);
    },
    [grid, simulation, editState]
  );

  // Handle grid cell click (for editing)
  const handleCellClick = useCallback(
    (coords: [number, number]) => {
      if (editMode && !isRunning) {
        const newGrid = grid.clone();
        const currentState = grid.getCell(coords);
        const nextState = currentState === 0 ? editState : 0;
        newGrid.setCell(coords, nextState);
        setGrid(newGrid);
        simulation.setGrid(newGrid);
      }
    },
    [editMode, grid, simulation, editState, isRunning]
  );

  // Simulation step function
  const handleStep = useCallback(() => {
    const result = simulation.step();
    setGrid(result.grid);
    setGeneration(result.generation);
  }, [simulation]);

  // Play/Pause toggle
  const handlePlayPause = useCallback(() => {
    setIsRunning((prev: boolean) => !prev);
  }, []);

  // Reset simulation
  const handleReset = useCallback(() => {
    simulation.reset();
    setGrid(simulation.getGrid());
    setGeneration(0);
    setIsRunning(false);
  }, [simulation]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const interval = 1000 / speed; // milliseconds per step

    const animate = (currentTime: number) => {
      if (lastStepTimeRef.current === 0) {
        lastStepTimeRef.current = currentTime;
      }

      const elapsed = currentTime - lastStepTimeRef.current;

      if (elapsed >= interval) {
        handleStep();
        lastStepTimeRef.current = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      lastStepTimeRef.current = 0;
    };
  }, [isRunning, speed, handleStep]);

  // Calculate optimal cell size based on grid
  useEffect(() => {
    const sizes = grid.getSizes();
    const maxGridSize = Math.max(...sizes);
    const targetSize = Math.max(5, Math.floor(500 / maxGridSize));
    setCellSize(targetSize);
  }, [grid]);

  return (
    <div className="simulator-container">
      <header className="simulator-header">
        <h1>🧬 ConwayVerse</h1>
        <p>A configurable cellular automaton simulator</p>
      </header>

      <div className="simulator-layout">
        <aside className="config-sidebar">
          <ConfigPanel
            config={config}
            onConfigChange={handleConfigChange}
            onPatternApply={handlePatternApply}
          />
        </aside>

        <main className="simulator-main">
          <div className="grid-container">
            <GridRenderer
              grid={grid}
              cellSize={cellSize}
              onCellClick={handleCellClick}
              showGrid={cellSize > 5}
            />
          </div>
        </main>

        <aside className="controls-sidebar">
          <SimulationControls
            isRunning={isRunning}
            generation={generation}
            speed={speed}
            onPlayPause={handlePlayPause}
            onStep={handleStep}
            onReset={handleReset}
            onSpeedChange={setSpeed}
          />

          <div className="edit-controls">
            <h3>Edit Mode</h3>
            <div className="edit-toggles">
              <button
                className={`edit-btn ${editMode ? 'active' : ''}`}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? '✏️ Editing' : '🔒 Locked'}
              </button>
            </div>
            {editMode && (
              <div className="state-selector">
                <label htmlFor="edit-state">Cell State:</label>
                <input
                  id="edit-state"
                  type="number"
                  min="0"
                  max="255"
                  value={editState}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditState(Number(e.target.value))}
                />
              </div>
            )}
            <p className="edit-hint">
              {editMode ? 'Click cells to toggle state' : 'Enable to edit grid'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
