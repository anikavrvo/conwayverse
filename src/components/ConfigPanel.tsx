/**
 * Configuration Panel Component
 * Allows users to configure grid size, neighborhood, rules, and initial patterns
 */

import React, { useState } from 'react';
import {
  type SimulationConfig,
  PresetConfigs,
  Patterns,
} from '../engine';
import './ConfigPanel.css';

interface ConfigPanelProps {
  config: SimulationConfig;
  onConfigChange: (config: SimulationConfig) => void;
  onPatternApply: (cells: Array<[number, number]>) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onConfigChange,
  onPatternApply,
}) => {
  const [gridSize, setGridSize] = useState(config.grid.size as number);
  const [radius, setRadius] = useState(config.neighborhood.radius);
  const [wrapping, setWrapping] = useState(config.neighborhood.wrapping ?? false);
  const [preset, setPreset] = useState('conway');

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
    const newConfig: SimulationConfig = {
      ...config,
      grid: {
        ...config.grid,
        size: newSize,
      },
    };
    onConfigChange(newConfig);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    const newConfig: SimulationConfig = {
      ...config,
      neighborhood: {
        ...config.neighborhood,
        radius: newRadius,
      },
    };
    onConfigChange(newConfig);
  };

  const handleWrappingChange = (newWrapping: boolean) => {
    setWrapping(newWrapping);
    const newConfig: SimulationConfig = {
      ...config,
      neighborhood: {
        ...config.neighborhood,
        wrapping: newWrapping,
      },
    };
    onConfigChange(newConfig);
  };

  const handlePresetChange = (presetName: string) => {
    setPreset(presetName);
    let newConfig: SimulationConfig;

    switch (presetName) {
      case 'conway':
        newConfig = PresetConfigs.conwayGameOfLife2D(gridSize);
        break;
      case 'conway3d':
        newConfig = PresetConfigs.conwayGameOfLife3D(Math.min(gridSize, 20));
        break;
      case 'averaging':
        newConfig = PresetConfigs.multiStateAveraging(gridSize, 256);
        break;
      case 'decay':
        newConfig = PresetConfigs.decaySimulation(gridSize, 256, 0.15);
        break;
      default:
        newConfig = PresetConfigs.conwayGameOfLife2D(gridSize);
    }

    onConfigChange(newConfig);
  };

  const applyPattern = (patternName: string) => {
    let pattern: Array<[number, number]>;

    switch (patternName) {
      case 'blinker':
        pattern = Patterns.blinker2D();
        break;
      case 'block':
        pattern = Patterns.block2D();
        break;
      case 'glider':
        pattern = Patterns.glider2D();
        break;
      case 'random':
        pattern = Patterns.random(
          Math.min(gridSize, 30),
          Math.min(gridSize, 30),
          0.2
        );
        break;
      default:
        pattern = [];
    }

    onPatternApply(pattern);
  };

  return (
    <div className="config-panel">
      <div className="panel-section">
        <h3>Grid Configuration</h3>
        <div className="config-item">
          <label htmlFor="grid-size">Grid Size:</label>
          <input
            id="grid-size"
            type="number"
            min="10"
            max="200"
            value={gridSize}
            onChange={(e) => handleGridSizeChange(Number(e.target.value))}
          />
          <span className="value-display">{gridSize}×{gridSize}</span>
        </div>
      </div>

      <div className="panel-section">
        <h3>Neighborhood</h3>
        <div className="config-item">
          <label htmlFor="radius">Radius:</label>
          <input
            id="radius"
            type="number"
            min="1"
            max="5"
            value={radius}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
          />
          <span className="value-display">r={radius}</span>
        </div>
        <div className="config-item checkbox">
          <input
            id="wrapping"
            type="checkbox"
            checked={wrapping}
            onChange={(e) => handleWrappingChange(e.target.checked)}
          />
          <label htmlFor="wrapping">Toroidal (Wrapping)</label>
        </div>
      </div>

      <div className="panel-section">
        <h3>Presets</h3>
        <div className="preset-buttons">
          <button
            className={`preset-btn ${preset === 'conway' ? 'active' : ''}`}
            onClick={() => handlePresetChange('conway')}
          >
            Conway 2D
          </button>
          <button
            className={`preset-btn ${preset === 'conway3d' ? 'active' : ''}`}
            onClick={() => handlePresetChange('conway3d')}
          >
            Conway 3D
          </button>
          <button
            className={`preset-btn ${preset === 'averaging' ? 'active' : ''}`}
            onClick={() => handlePresetChange('averaging')}
          >
            Averaging
          </button>
          <button
            className={`preset-btn ${preset === 'decay' ? 'active' : ''}`}
            onClick={() => handlePresetChange('decay')}
          >
            Decay
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3>Initial Patterns</h3>
        <div className="pattern-buttons">
          <button className="pattern-btn" onClick={() => applyPattern('blinker')}>
            Blinker
          </button>
          <button className="pattern-btn" onClick={() => applyPattern('block')}>
            Block
          </button>
          <button className="pattern-btn" onClick={() => applyPattern('glider')}>
            Glider
          </button>
          <button className="pattern-btn" onClick={() => applyPattern('random')}>
            Random
          </button>
        </div>
      </div>
    </div>
  );
};
