/**
 * Core types for the ConwayVerse simulation engine
 */

import type { Grid } from "./Grid";

/** Represents a coordinate in n-dimensional space */
export type Coordinate = number[];

/** Cell state: can be a number (0-255) for multiple states */
export type CellState = number;

/** Represents a cell in the grid with its coordinates and state */
export interface Cell {
  coords: Coordinate;
  state: CellState;
}

/** Configuration for the grid */
export interface GridConfig {
  /** Number of dimensions (2 or 3) */
  dimensions: 2 | 3;
  /** Size of each dimension */
  size: number | number[];
  /** Default cell state for empty cells */
  defaultState?: CellState;
}

/** Configuration for neighborhood calculation */
export interface NeighborhoodConfig {
  /** Radius of the neighborhood bubble (0 = Moore neighborhood for 2D) */
  radius: number;
  /** Whether to include diagonals (for 2D) */
  includeDiagonals?: boolean;
  /** Whether to wrap around edges (toroidal topology) */
  wrapping?: boolean;
}

/** Rule for cell state transition */
export interface Rule {
  /** Current state of the cell */
  cellState: CellState;
  /** Condition function: given neighbor states count, determine next state */
  condition: (neighborStateCounts: NeighborStateCounts) => CellState;
}

/** Count of neighbors by state */
export interface NeighborStateCounts {
  [state: number]: number;
}

/** Configuration for the simulation */
export interface SimulationConfig {
  grid: GridConfig;
  neighborhood: NeighborhoodConfig;
  rules: Rule[];
  /** Maximum number of cell states (e.g., 256 for 8-bit states) */
  maxStates?: number;
}

/** Result of a single simulation step */
export interface StepResult {
  /** The updated grid state */
  grid: Grid;
  /** Generation number */
  generation: number;
  /** Statistics about the step */
  stats: StepStats;
}

/** Statistics about a simulation step */
export interface StepStats {
  /** Total number of cells that changed state */
  changedCells: number;
  /** Distribution of cell states in the new grid */
  stateDistribution: { [state: number]: number };
}
