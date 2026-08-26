/**
 * Rule engine for ConwayVerse
 * Handles multi-state cellular automaton rules
 */

import { type Rule, type CellState, type NeighborStateCounts } from './types';

export class RuleEngine {
  private rules: Map<CellState, (neighbors: NeighborStateCounts) => CellState>;

  constructor(rules: Rule[]) {
    this.rules = new Map();
    for (const rule of rules) {
      this.rules.set(rule.cellState, rule.condition);
    }
  }

  /**
   * Apply rules to determine the next state of a cell
   */
  getNextState(
    currentState: CellState,
    neighborStateCounts: NeighborStateCounts
  ): CellState {
    const rule = this.rules.get(currentState);
    if (rule) {
      return rule(neighborStateCounts);
    }
    // If no rule defined, cell stays in current state
    return currentState;
  }

  /**
   * Classic Conway's Game of Life rules for 2D
   * States: 0 = dead, 1 = alive
   */
  static conwayGameOfLife(): Rule[] {
    return [
      {
        cellState: 0, // Dead cell
        condition: (neighbors) => {
          const aliveCount = neighbors[1] ?? 0;
          return aliveCount === 3 ? 1 : 0; // Birth with exactly 3 alive neighbors
        },
      },
      {
        cellState: 1, // Alive cell
        condition: (neighbors) => {
          const aliveCount = neighbors[1] ?? 0;
          return aliveCount === 2 || aliveCount === 3 ? 1 : 0; // Survive with 2-3 alive neighbors
        },
      },
    ];
  }

  /**
   * Create a rule where cells toggle between two states based on neighbor count
   */
  static toggleRule(
    state1: CellState,
    state2: CellState,
    toggleThreshold: number
  ): Rule[] {
    return [
      {
        cellState: state1,
        condition: (neighbors) => {
          const neighborCount = Object.values(neighbors).reduce((a, b) => a + b, 0);
          return neighborCount >= toggleThreshold ? state2 : state1;
        },
      },
      {
        cellState: state2,
        condition: (neighbors) => {
          const neighborCount = Object.values(neighbors).reduce((a, b) => a + b, 0);
          return neighborCount < toggleThreshold ? state1 : state2;
        },
      },
    ];
  }

  /**
   * Create a rule for averaging neighbor states (gradient-based)
   */
  static averagingRule(stateRange: number): Rule[] {
    const rules: Rule[] = [];

    for (let state = 0; state < stateRange; state++) {
      rules.push({
        cellState: state as CellState,
        condition: (neighbors) => {
          let sum = 0;
          let count = 0;
          for (const [neighborState, neighborCount] of Object.entries(neighbors)) {
            sum += parseInt(neighborState) * neighborCount;
            count += neighborCount;
          }
          const average = count > 0 ? Math.round(sum / count) : state;
          return Math.min(Math.max(average, 0), stateRange - 1) as CellState;
        },
      });
    }

    return rules;
  }

  /**
   * Create a rule where cells decay gradually
   * Higher neighbor count increases decay rate
   */
  static decayRule(stateRange: number, decayFactor: number = 0.1): Rule[] {
    const rules: Rule[] = [];

    for (let state = 0; state < stateRange; state++) {
      rules.push({
        cellState: state as CellState,
        condition: (neighbors) => {
          if (state === 0) return 0;

          const neighborCount = Object.values(neighbors).reduce((a, b) => a + b, 0);
          const decayAmount = Math.ceil(decayFactor * neighborCount);
          return Math.max(0, state - decayAmount) as CellState;
        },
      });
    }

    return rules;
  }
}
