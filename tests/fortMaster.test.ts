import { describe, it, expect } from 'vitest';
import {
  createDefaultFortGrid,
  calculateFortMetrics,
  canPlaceStructure,
  placeStructure,
  removeStructure,
  evaluateCrisisEvent,
  INITIAL_FORT_RESOURCES,
  FORT_CRISIS_EVENTS,
} from '../src/domain/fortMaster/fortEngine';

describe('Fort Master Engine', () => {
  it('initializes a 5x5 grid with proper terrain features', () => {
    const grid = createDefaultFortGrid();
    expect(grid).toHaveLength(25);
    const catchmentTiles = grid.filter(t => t.terrain === 'water_catchment');
    expect(catchmentTiles.length).toBeGreaterThan(0);
  });

  it('evaluates resource constraints when placing structures', () => {
    const grid = createDefaultFortGrid();
    const tile = grid[0];
    const lowResources = { stone: 5, water: 0, food: 0, knowledge: 0 };

    const check = canPlaceStructure(tile, 'baoli', lowResources);
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('Insufficient stone');
  });

  it('places a structure and deducts resources correctly', () => {
    const grid = createDefaultFortGrid();
    const resources = { ...INITIAL_FORT_RESOURCES };

    const result = placeStructure(grid, 2, 2, 'baoli', resources);
    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.newResources.stone).toBe(resources.stone - 25);
    const placedTile = result.newGrid.find(t => t.x === 2 && t.y === 2);
    expect(placedTile?.structure).toBe('baoli');

    const metrics = calculateFortMetrics(result.newGrid);
    expect(metrics.waterCapacity).toBeGreaterThan(0);
  });

  it('refunds partial resources on structure removal', () => {
    const grid = createDefaultFortGrid();
    const resources = { ...INITIAL_FORT_RESOURCES };

    const placed = placeStructure(grid, 2, 2, 'granary', resources);
    expect(placed).not.toBeNull();
    if (!placed) return;

    const removed = removeStructure(placed.newGrid, 2, 2, placed.newResources);
    expect(removed).not.toBeNull();
    if (!removed) return;

    const targetTile = removed.newGrid.find(t => t.x === 2 && t.y === 2);
    expect(targetTile?.structure).toBeUndefined();
    expect(removed.newResources.stone).toBeGreaterThan(placed.newResources.stone);
  });

  it('evaluates monsoon crisis event deterministically based on water resilience', () => {
    const monsoonEvent = FORT_CRISIS_EVENTS[0];
    const lowMetrics = {
      waterCapacity: 10,
      foodStorage: 10,
      defenceRating: 10,
      waterResilience: 10,
      overallScore: 20,
    };

    const criticalOutcome = evaluateCrisisEvent(lowMetrics, monsoonEvent);
    expect(criticalOutcome.rating).toBe('critical');

    const highMetrics = {
      waterCapacity: 60,
      foodStorage: 45,
      defenceRating: 50,
      waterResilience: 60,
      overallScore: 85,
    };

    const optimalOutcome = evaluateCrisisEvent(highMetrics, monsoonEvent);
    expect(optimalOutcome.rating).toBe('optimal');
    expect(optimalOutcome.success).toBe(true);
  });
});
