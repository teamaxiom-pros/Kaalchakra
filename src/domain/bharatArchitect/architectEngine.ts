import {
  SettlementComponentType,
  SettlementComponentDef,
  SettlementTile,
  SettlementResources,
  SettlementEvaluation
} from './architectTypes';

export const SETTLEMENT_COMPONENTS: Record<SettlementComponentType, SettlementComponentDef> = {
  residential_block: {
    type: 'residential_block',
    name: 'Residential Block',
    nativeName: 'Griha / Harappan Courtyard Home',
    cost: { bricks: 15, timber: 5 },
    description: 'Baked-brick dwelling with central open courtyard, private bath, and stairwell.',
    culturalNote: 'Houses at Mohenjo-daro opened inward toward quiet courtyards rather than dusty streets.',
    icon: '🏠',
  },
  paved_road: {
    type: 'paved_road',
    name: 'Brick Thoroughfare',
    nativeName: 'Mahapatha / Orthogonal Road',
    cost: { bricks: 8, timber: 0 },
    description: 'Wide street laid on cardinal north-south or east-west grid axes with rounded corners.',
    culturalNote: 'Rounded street corners allowed bullock carts to turn without damaging brick facades.',
    icon: '🛣️',
  },
  covered_drain: {
    type: 'covered_drain',
    name: 'Covered Drainage Conduit',
    nativeName: 'Nali / Brick Sump Conduit',
    cost: { bricks: 10, timber: 2 },
    description: 'Sloped drainage conduit covered with removable limestone slabs and silt-trapping sumps.',
    culturalNote: 'Terracotta pipes from household baths fed directly into street-level covered drains.',
    icon: '🚰',
  },
  water_reservoir: {
    type: 'water_reservoir',
    name: 'Rock Reservoir',
    nativeName: 'Jalashaya / Dholavira Reservoir',
    cost: { bricks: 25, timber: 0 },
    description: 'Monumental rock-hewn water catchment basin storing precious seasonal rainwater.',
    culturalNote: 'Dholavira’s 16 interconnected reservoirs held over 250,000 cubic metres of freshwater.',
    icon: '🌊',
  },
  civic_granary: {
    type: 'civic_granary',
    name: 'Civic Granary',
    nativeName: 'Dhanyagara / Central Granary',
    cost: { bricks: 20, timber: 10 },
    description: 'Elevated podium warehouse with sub-floor air vents to keep grain dry from damp soil.',
    culturalNote: 'Harappa’s great granary had 12 vaulted chambers elevated above the Ravi flood plain.',
    icon: '🌾',
  },
  great_bath: {
    type: 'great_bath',
    name: 'The Great Bath',
    nativeName: 'Mahasnanagar / Public Tank',
    cost: { bricks: 30, timber: 5 },
    description: 'Finely fitted baked brick basin lined with natural bitumen waterproofing.',
    culturalNote: 'Used for communal gatherings and spiritual purification across the Indus civilization.',
    icon: '✨',
  },
};

export const INITIAL_SETTLEMENT_RESOURCES: SettlementResources = {
  bricks: 120,
  timber: 40,
  labour: 50,
};

export function createDefaultSettlementGrid(width = 6, height = 5): SettlementTile[] {
  const grid: SettlementTile[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      grid.push({ x, y });
    }
  }
  return grid;
}

export function canPlaceComponent(
  tile: SettlementTile,
  type: SettlementComponentType,
  resources: SettlementResources
): { allowed: boolean; reason?: string } {
  if (tile.component) {
    return { allowed: false, reason: 'Tile is already occupied. Clear it first.' };
  }

  const def = SETTLEMENT_COMPONENTS[type];
  if (!def) return { allowed: false, reason: 'Unknown component' };

  if (resources.bricks < def.cost.bricks) {
    return { allowed: false, reason: `Requires ${def.cost.bricks} bricks.` };
  }
  if (resources.timber < def.cost.timber) {
    return { allowed: false, reason: `Requires ${def.cost.timber} timber.` };
  }

  return { allowed: true };
}

export function placeComponent(
  grid: SettlementTile[],
  x: number,
  y: number,
  type: SettlementComponentType,
  resources: SettlementResources
): { newGrid: SettlementTile[]; newResources: SettlementResources } | null {
  const index = grid.findIndex(t => t.x === x && t.y === y);
  if (index === -1) return null;

  const tile = grid[index];
  const check = canPlaceComponent(tile, type, resources);
  if (!check.allowed) return null;

  const def = SETTLEMENT_COMPONENTS[type];
  const newGrid = [...grid];
  newGrid[index] = { ...tile, component: type };

  const newResources: SettlementResources = {
    bricks: resources.bricks - def.cost.bricks,
    timber: resources.timber - def.cost.timber,
    labour: resources.labour - 2,
  };

  return { newGrid, newResources };
}

export function removeComponent(
  grid: SettlementTile[],
  x: number,
  y: number,
  resources: SettlementResources
): { newGrid: SettlementTile[]; newResources: SettlementResources } | null {
  const index = grid.findIndex(t => t.x === x && t.y === y);
  if (index === -1) return null;

  const tile = grid[index];
  if (!tile.component) return null;

  const def = SETTLEMENT_COMPONENTS[tile.component];
  const newGrid = [...grid];
  newGrid[index] = { ...tile, component: undefined };

  const newResources: SettlementResources = {
    bricks: resources.bricks + Math.floor(def.cost.bricks * 0.6),
    timber: resources.timber + Math.floor(def.cost.timber * 0.6),
    labour: resources.labour + 1,
  };

  return { newGrid, newResources };
}

export function evaluateSettlement(grid: SettlementTile[], width = 6, height = 5): SettlementEvaluation {
  const tileMap = new Map<string, SettlementComponentType>();
  grid.forEach(t => {
    if (t.component) tileMap.set(`${t.x},${t.y}`, t.component);
  });

  const houses: { x: number; y: number }[] = [];
  let roadCount = 0;
  let drainCount = 0;
  let reservoirCount = 0;
  let granaryCount = 0;
  let bathCount = 0;

  grid.forEach(t => {
    if (t.component === 'residential_block') houses.push({ x: t.x, y: t.y });
    else if (t.component === 'paved_road') roadCount++;
    else if (t.component === 'covered_drain') drainCount++;
    else if (t.component === 'water_reservoir') reservoirCount++;
    else if (t.component === 'civic_granary') granaryCount++;
    else if (t.component === 'great_bath') bathCount++;
  });

  if (houses.length === 0) {
    return {
      roadAccessibilityScore: 0,
      sanitationScore: 0,
      floodResilienceScore: 0,
      civicBalanceScore: 0,
      overallScore: 0,
      houseCount: 0,
      connectedDrainCount: 0,
      connectedRoadCount: 0,
      summary: 'No residential blocks established yet. Build houses to begin your settlement.',
    };
  }

  // Helper to check 4-directional adjacency
  const getNeighbors = (x: number, y: number): string[] => {
    const coords = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ];
    return coords
      .filter(c => c.x >= 0 && c.x < width && c.y >= 0 && c.y < height)
      .map(c => `${c.x},${c.y}`);
  };

  let connectedRoadCount = 0;
  let connectedDrainCount = 0;

  houses.forEach(h => {
    const neighbors = getNeighbors(h.x, h.y);
    const hasRoad = neighbors.some(n => tileMap.get(n) === 'paved_road');
    const hasDrain = neighbors.some(n => tileMap.get(n) === 'covered_drain');

    if (hasRoad) connectedRoadCount++;
    if (hasDrain) connectedDrainCount++;
  });

  const roadAccessibilityScore = Math.round((connectedRoadCount / houses.length) * 100);
  const sanitationScore = Math.round((connectedDrainCount / houses.length) * 100);

  // Flood resilience depends on reservoirs and drainage proportion
  const targetDrains = houses.length;
  const drainRatio = Math.min(1.0, drainCount / Math.max(1, targetDrains));
  const reservoirFactor = Math.min(1.0, reservoirCount / 2);
  const floodResilienceScore = Math.round((drainRatio * 0.6 + reservoirFactor * 0.4) * 100);

  // Civic balance: houses need granary and great bath within reasonable proximity
  const civicBalanceScore = Math.min(
    100,
    Math.round(
      (granaryCount > 0 ? 40 : 0) +
      (bathCount > 0 ? 30 : 0) +
      Math.min(30, houses.length * 6)
    )
  );

  const overallScore = Math.round(
    roadAccessibilityScore * 0.3 +
    sanitationScore * 0.3 +
    floodResilienceScore * 0.25 +
    civicBalanceScore * 0.15
  );

  let summary = '';
  if (overallScore >= 80) {
    summary =
      'Exemplary Harappan urban planning! Every residence benefits from orthogonal road transit and covered sanitation, while reservoirs safeguard against deluge.';
  } else if (overallScore >= 50) {
    summary =
      'Functional settlement, but certain homes lack direct covered drainage or road access. Expand your paved grid to elevate municipal harmony.';
  } else {
    summary =
      'Disorganized settlement pattern. Several residences risk monsoon flooding and poor sanitary outflow. Connect them via brick roads and covered drainage conduits.';
  }

  return {
    roadAccessibilityScore,
    sanitationScore,
    floodResilienceScore,
    civicBalanceScore,
    overallScore,
    houseCount: houses.length,
    connectedDrainCount,
    connectedRoadCount,
    summary,
  };
}
