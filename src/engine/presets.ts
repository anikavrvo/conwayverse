/**
 * Preset configurations and utilities for ConwayVerse
 * Provides common simulation setups for quick initialization
 */

import { type SimulationConfig } from './types';
import { RuleEngine } from './RuleEngine';
import { Neighborhood } from './Neighborhood';

export class PresetConfigs {
  /**
   * Classic 2D Conway's Game of Life
   */
  static conwayGameOfLife2D(gridSize: number = 50): SimulationConfig {
    return {
      grid: {
        dimensions: 2,
        size: gridSize,
        defaultState: 0,
      },
      neighborhood: Neighborhood.mooreNeighborhood2D(),
      rules: RuleEngine.conwayGameOfLife(),
    };
  }

  /**
   * 3D variant of Conway's Game of Life
   */
  static conwayGameOfLife3D(gridSize: number = 20): SimulationConfig {
    return {
      grid: {
        dimensions: 3,
        size: gridSize,
        defaultState: 0,
      },
      neighborhood: Neighborhood.mooreNeighborhood3D(),
      rules: RuleEngine.conwayGameOfLife(),
    };
  }

  /**
   * Multi-state cellular automaton with averaging
   */
  static multiStateAveraging(
    gridSize: number = 50,
    stateRange: number = 256
  ): SimulationConfig {
    return {
      grid: {
        dimensions: 2,
        size: gridSize,
        defaultState: 0,
      },
      neighborhood: Neighborhood.mooreNeighborhood2D(),
      rules: RuleEngine.averagingRule(stateRange),
      maxStates: stateRange,
    };
  }

  /**
   * Decay-based simulation (cells gradually fade away)
   */
  static decaySimulation(
    gridSize: number = 50,
    stateRange: number = 256,
    decayFactor: number = 0.1
  ): SimulationConfig {
    return {
      grid: {
        dimensions: 2,
        size: gridSize,
        defaultState: 0,
      },
      neighborhood: Neighborhood.mooreNeighborhood2D(),
      rules: RuleEngine.decayRule(stateRange, decayFactor),
      maxStates: stateRange,
    };
  }

  /**
   * Small-world variant for rapid testing
   */
  static quickTest(): SimulationConfig {
    return this.conwayGameOfLife2D(20);
  }
}

/**
 * Common patterns for seeding simulations
 */
export class Patterns {
  /**
   * Blinker - oscillates between two states
   */
  static blinker2D(): Array<[number, number]> {
    return [
      [10, 10],
      [10, 11],
      [10, 12],
    ];
  }

  /**
   * Block - stable pattern
   */
  static block2D(): Array<[number, number]> {
    return [
      [10, 10],
      [10, 11],
      [11, 10],
      [11, 11],
    ];
  }

  /**
   * Glider - moving pattern
   */
  static glider2D(): Array<[number, number]> {
    return [
      [10, 11],
      [11, 12],
      [12, 10],
      [12, 11],
      [12, 12],
    ];
  }

  /**
   * Random pattern
   */
  static random(width: number, height: number, density: number = 0.3): Array<[number, number]> {
    const pattern: Array<[number, number]> = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (Math.random() < density) {
          pattern.push([x, y]);
        }
      }
    }
    return pattern;
  }

  /**
   * Randomize a portion of the grid
   */
  static randomRect(
    x: number,
    y: number,
    width: number,
    height: number,
    density: number = 0.3
  ): Array<[number, number]> {
    const pattern: Array<[number, number]> = [];
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        if (Math.random() < density) {
          pattern.push([i, j]);
        }
      }
    }
    return pattern;
  }
}
