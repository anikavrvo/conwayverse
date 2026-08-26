/**
 * Main simulation engine for ConwayVerse
 * Orchestrates grid evolution using neighborhoods and rules
 */

import { Grid } from './Grid';
import { Neighborhood } from './Neighborhood';
import { RuleEngine } from './RuleEngine';
import {
  type SimulationConfig,
  type StepResult,
  type StepStats,
  type NeighborStateCounts,
  type Coordinate,
} from './types';

export class Simulation {
  private grid: Grid;
  private neighborhood: Neighborhood;
  private ruleEngine: RuleEngine;
  private generation: number = 0;
  private config: SimulationConfig;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.grid = new Grid(config.grid);
    this.neighborhood = new Neighborhood(config.neighborhood, config.grid.dimensions);
    this.ruleEngine = new RuleEngine(config.rules);
  }

  /**
   * Get the current grid
   */
  getGrid(): Grid {
    return this.grid;
  }

  /**
   * Get the current generation number
   */
  getGeneration(): number {
    return this.generation;
  }

  /**
   * Set the grid state (useful for loading initial configurations)
   */
  setGrid(grid: Grid): void {
    this.grid = grid.clone();
  }

  /**
   * Set cell state directly
   */
  setCell(coords: Coordinate, state: number): void {
    this.grid.setCell(coords, state);
  }

  /**
   * Get cell state
   */
  getCell(coords: Coordinate): number {
    return this.grid.getCell(coords);
  }

  /**
   * Reset the simulation
   */
  reset(): void {
    this.generation = 0;
    this.grid.clear();
  }

  /**
   * Execute one step of the simulation
   */
  step(): StepResult {
    const newGrid = this.grid.clone();
    const wrapping = this.config.neighborhood.wrapping ?? false;
    let changedCells = 0;

    // Get all cells that might change (including neighbors of live cells)
    const cellsToCheck = new Set<string>();
    
    // Add all non-default cells and their neighbors
    for (const cell of this.grid.getAllCells()) {
      cellsToCheck.add(cell.coords.join(','));
      
      const neighbors = this.neighborhood.getNeighbors(cell.coords);
      for (const neighbor of neighbors) {
        const normalized = this.grid.normalizeCoords(neighbor, wrapping);
        if (normalized) {
          cellsToCheck.add(normalized.join(','));
        }
      }
    }

    // Also check some "empty" cells around the populated area to enable growth
    // This is important for patterns that can expand
    for (const cell of this.grid.getAllCells()) {
      const neighbors = this.neighborhood.getNeighbors(cell.coords);
      for (const neighbor of neighbors) {
        const normalized = this.grid.normalizeCoords(neighbor, wrapping);
        if (normalized) {
          const cellState = this.grid.getCell(normalized);
          if (cellState === 0) {
            cellsToCheck.add(normalized.join(','));
          }
        }
      }
    }

    // Process each cell
    for (const cellKey of cellsToCheck) {
      const coords = cellKey.split(',').map(Number);
      const currentState = this.grid.getCell(coords);

      // Count neighbors by state
      const neighborStateCounts = this.countNeighborStates(coords, wrapping);

      // Apply rules to get next state
      const nextState = this.ruleEngine.getNextState(currentState, neighborStateCounts);

      // Update grid if state changed
      if (nextState !== currentState) {
        newGrid.setCell(coords, nextState);
        changedCells++;
      }
    }

    this.grid = newGrid;
    this.generation++;

    const stats: StepStats = {
      changedCells,
      stateDistribution: this.grid.getStateDistribution(),
    };

    return {
      grid: this.grid.clone(),
      generation: this.generation,
      stats,
    };
  }

  /**
   * Run multiple steps
   */
  steps(count: number): StepResult {
    let result: StepResult = {
      grid: this.grid.clone(),
      generation: this.generation,
      stats: {
        changedCells: 0,
        stateDistribution: this.grid.getStateDistribution(),
      },
    };

    for (let i = 0; i < count; i++) {
      result = this.step();
    }

    return result;
  }

  /**
   * Count neighbors by state for a given cell
   */
  private countNeighborStates(
    coords: Coordinate,
    wrapping: boolean
  ): NeighborStateCounts {
    const counts: NeighborStateCounts = {};
    const neighbors = this.neighborhood.getNeighbors(coords);

    for (const neighbor of neighbors) {
      const normalized = this.grid.normalizeCoords(neighbor, wrapping);
      if (normalized) {
        const state = this.grid.getCell(normalized);
        counts[state] = (counts[state] ?? 0) + 1;
      }
    }

    return counts;
  }

  /**
   * Get configuration
   */
  getConfig(): SimulationConfig {
    return this.config;
  }

  /**
   * Get neighborhood information
   */
  getNeighborhoodInfo() {
    return {
      neighborCount: this.neighborhood.getNeighborCount(),
      radius: this.config.neighborhood.radius,
      wrapping: this.config.neighborhood.wrapping ?? false,
    };
  }
}
