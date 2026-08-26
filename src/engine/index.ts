/**
 * ConwayVerse Simulation Engine
 * Export all engine components for easy access
 */

export { Grid } from './Grid';
export { Neighborhood } from './Neighborhood';
export { RuleEngine } from './RuleEngine';
export { Simulation } from './Simulation';
export { PresetConfigs, Patterns } from './presets';

export type {
  Coordinate,
  CellState,
  Cell,
  GridConfig,
  NeighborhoodConfig,
  Rule,
  NeighborStateCounts,
  SimulationConfig,
  StepResult,
  StepStats,
} from './types';
