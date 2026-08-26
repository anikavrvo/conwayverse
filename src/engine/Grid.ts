/**
 * Grid data structure for ConwayVerse
 * Supports 2D and 3D grids with configurable dimensions and wrapping
 */

import { type CellState, type Coordinate, type GridConfig, type Cell } from './types';

export class Grid {
  private dimensions: 2 | 3;
  private sizes: number[];
  private cells: Map<string, CellState>;
  private defaultState: CellState;

  constructor(config: GridConfig) {
    this.dimensions = config.dimensions;
    
    // Normalize sizes to array
    if (Array.isArray(config.size)) {
      this.sizes = config.size;
    } else {
      this.sizes = new Array(config.dimensions).fill(config.size);
    }

    if (this.sizes.length !== this.dimensions) {
      throw new Error(
        `Grid dimensions mismatch: expected ${this.dimensions}, got ${this.sizes.length}`
      );
    }

    this.defaultState = config.defaultState ?? 0;
    this.cells = new Map();
  }

  /**
   * Convert coordinates to a string key for the Map
   */
  private coordsToKey(coords: Coordinate): string {
    return coords.join(',');
  }

  /**
   * Convert a string key back to coordinates
   */
  private keyToCoords(key: string): Coordinate {
    return key.split(',').map(Number);
  }

  /**
   * Check if coordinates are within bounds
   */
  isInBounds(coords: Coordinate): boolean {
    if (coords.length !== this.dimensions) return false;
    return coords.every((val, i) => val >= 0 && val < this.sizes[i]);
  }

  /**
   * Normalize coordinates with wrapping support
   */
  normalizeCoords(coords: Coordinate, wrapping: boolean = false): Coordinate | null {
    if (coords.length !== this.dimensions) return null;

    if (wrapping) {
      return coords.map((val, i) => {
        const size = this.sizes[i];
        return ((val % size) + size) % size;
      });
    }

    return this.isInBounds(coords) ? coords : null;
  }

  /**
   * Get cell state at coordinates
   */
  getCell(coords: Coordinate): CellState {
    const normalized = this.normalizeCoords(coords, false);
    if (!normalized) return this.defaultState;
    
    const key = this.coordsToKey(normalized);
    return this.cells.get(key) ?? this.defaultState;
  }

  /**
   * Set cell state at coordinates
   */
  setCell(coords: Coordinate, state: CellState): void {
    const normalized = this.normalizeCoords(coords, false);
    if (!normalized) return;

    const key = this.coordsToKey(normalized);
    if (state === this.defaultState) {
      this.cells.delete(key);
    } else {
      this.cells.set(key, state);
    }
  }

  /**
   * Get all non-default cells
   */
  getAllCells(): Cell[] {
    return Array.from(this.cells.entries()).map(([key, state]) => ({
      coords: this.keyToCoords(key),
      state,
    }));
  }

  /**
   * Clear the grid (set all cells to default state)
   */
  clear(): void {
    this.cells.clear();
  }

  /**
   * Get grid dimensions
   */
  getDimensions(): 2 | 3 {
    return this.dimensions;
  }

  /**
   * Get grid sizes
   */
  getSizes(): number[] {
    return [...this.sizes];
  }

  /**
   * Create a deep copy of the grid
   */
  clone(): Grid {
    const newGrid = new Grid({
      dimensions: this.dimensions,
      size: this.sizes,
      defaultState: this.defaultState,
    });

    for (const [key, state] of this.cells) {
      newGrid.cells.set(key, state);
    }

    return newGrid;
  }

  /**
   * Get the count of each cell state in the grid
   */
  getStateDistribution(): { [state: number]: number } {
    const distribution: { [state: number]: number } = {};
    
    // Count default state cells
    let totalCells = 1;
    for (const size of this.sizes) {
      totalCells *= size;
    }
    distribution[this.defaultState] = totalCells - this.cells.size;

    // Count non-default cells
    for (const state of this.cells.values()) {
      distribution[state] = (distribution[state] ?? 0) + 1;
    }

    return distribution;
  }
}
