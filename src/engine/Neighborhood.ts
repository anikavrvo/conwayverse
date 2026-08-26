/**
 * Neighborhood calculation for ConwayVerse
 * Supports configurable radius for 2D and 3D grids
 */

import { type Coordinate, type NeighborhoodConfig } from './types';

export class Neighborhood {
  private config: NeighborhoodConfig;
  private dimensions: number;
  private cachedNeighbors: Map<string, Coordinate[]> = new Map();

  constructor(config: NeighborhoodConfig, dimensions: 2 | 3) {
    this.config = config;
    this.dimensions = dimensions;
  }

  /**
   * Generate all neighbor offsets for the given configuration
   * For a radius r and 2D, this generates all coordinates where the Chebyshev distance ≤ r
   */
  private generateOffsets(): Coordinate[] {
    const offsets: Coordinate[] = [];
    const { radius } = this.config;

    // Generate all combinations of offsets within the radius
    const generateCombinations = (index: number, current: number[]) => {
      if (index === this.dimensions) {
        // Skip the center cell (all zeros)
        if (!current.every(v => v === 0)) {
          offsets.push([...current]);
        }
        return;
      }

      for (let i = -radius; i <= radius; i++) {
        current[index] = i;
        generateCombinations(index + 1, current);
      }
    };

    generateCombinations(0, []);
    return offsets;
  }

  /**
   * Get all neighbors of a cell at the given coordinates
   */
  getNeighbors(coords: Coordinate): Coordinate[] {
    const key = coords.join(',');
    
    if (this.cachedNeighbors.has(key)) {
      return this.cachedNeighbors.get(key)!;
    }

    const offsets = this.generateOffsets();
    const neighbors: Coordinate[] = [];

    for (const offset of offsets) {
      const neighbor = coords.map((val, i) => val + offset[i]);

      if (this.config.wrapping) {
        neighbors.push(neighbor);
      } else {
        // Only include neighbors within bounds (checked by caller)
        neighbors.push(neighbor);
      }
    }

    this.cachedNeighbors.set(key, neighbors);
    return neighbors;
  }

  /**
   * Get the number of neighbors (useful for understanding neighborhood size)
   */
  getNeighborCount(): number {
    return this.generateOffsets().length;
  }

  /**
   * Clear the offset cache (call this if configuration changes)
   */
  clearCache(): void {
    this.cachedNeighbors.clear();
  }

  /**
   * Create a neighborhood configuration for classic 2D Conway's Game of Life
   */
  static mooreNeighborhood2D(): NeighborhoodConfig {
    return {
      radius: 1,
      includeDiagonals: true,
      wrapping: false,
    };
  }

  /**
   * Create a neighborhood configuration for Von Neumann (cross) pattern in 2D
   */
  static vonNeumannNeighborhood2D(): NeighborhoodConfig {
    return {
      radius: 1,
      includeDiagonals: false,
      wrapping: false,
    };
  }

  /**
   * Create a neighborhood configuration for 3D
   */
  static mooreNeighborhood3D(): NeighborhoodConfig {
    return {
      radius: 1,
      wrapping: false,
    };
  }
}
