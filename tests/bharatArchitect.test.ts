import { describe, it, expect } from 'vitest';
import {
  createDefaultSettlementGrid,
  placeComponent,
  evaluateSettlement,
  INITIAL_SETTLEMENT_RESOURCES,
} from '../src/domain/bharatArchitect/architectEngine';

describe('Bharat Architect Engine', () => {
  it('initializes a default rectangular grid', () => {
    const grid = createDefaultSettlementGrid(6, 5);
    expect(grid).toHaveLength(30);
  });

  it('correctly scores road adjacency and drainage for Harappan homes', () => {
    let grid = createDefaultSettlementGrid(6, 5);
    let resources = { ...INITIAL_SETTLEMENT_RESOURCES };

    // Place a house at (1, 1)
    const p1 = placeComponent(grid, 1, 1, 'residential_block', resources);
    expect(p1).not.toBeNull();
    grid = p1!.newGrid;
    resources = p1!.newResources;

    // Before roads/drains
    const evalBefore = evaluateSettlement(grid, 6, 5);
    expect(evalBefore.houseCount).toBe(1);
    expect(evalBefore.roadAccessibilityScore).toBe(0);
    expect(evalBefore.sanitationScore).toBe(0);

    // Place a road adjacent at (1, 2)
    const p2 = placeComponent(grid, 1, 2, 'paved_road', resources);
    expect(p2).not.toBeNull();
    grid = p2!.newGrid;
    resources = p2!.newResources;

    // Place covered drain adjacent at (2, 1)
    const p3 = placeComponent(grid, 2, 1, 'covered_drain', resources);
    expect(p3).not.toBeNull();
    grid = p3!.newGrid;
    resources = p3!.newResources;

    const evalAfter = evaluateSettlement(grid, 6, 5);
    expect(evalAfter.roadAccessibilityScore).toBe(100);
    expect(evalAfter.sanitationScore).toBe(100);
    expect(evalAfter.overallScore).toBeGreaterThan(evalBefore.overallScore);
  });
});
