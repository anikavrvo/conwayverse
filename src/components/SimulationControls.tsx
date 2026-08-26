/**
 * Simulation Controls Component
 * Provides play/pause, step, speed, and reset controls
 */

import React from 'react';
import './SimulationControls.css';

interface SimulationControlsProps {
  isRunning: boolean;
  generation: number;
  speed: number;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  generation,
  speed,
  onPlayPause,
  onStep,
  onReset,
  onSpeedChange,
}) => {
  return (
    <div className="simulation-controls">
      <div className="control-group">
        <button
          className={`control-btn ${isRunning ? 'active' : ''}`}
          onClick={onPlayPause}
          title={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="control-btn" onClick={onStep} disabled={isRunning} title="Single step">
          ⏭ Step
        </button>
        <button className="control-btn" onClick={onReset} title="Reset simulation">
          🔄 Reset
        </button>
      </div>

      <div className="control-group">
        <label htmlFor="speed-slider">Speed:</label>
        <input
          id="speed-slider"
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="speed-slider"
          title="Generations per second"
        />
        <span className="speed-label">{speed} gen/s</span>
      </div>

      <div className="generation-info">
        Generation: <strong>{generation}</strong>
      </div>
    </div>
  );
};
