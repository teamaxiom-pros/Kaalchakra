import {
  FortStructureType,
  FortStructureDef,
  FortTile,
  FortResources,
  FortMetrics,
  FortCrisisEvent,
  FortTerrainType
} from './fortTypes';

export const FORT_STRUCTURES: Record<FortStructureType, FortStructureDef> = {
  baoli: {
    type: 'baoli',
    name: 'Rock-cut Cistern',
    nativeName: 'Tanka / Baoli',
    cost: { stone: 25, water: 0, food: 0 },
    waterBuff: 35,
    defenceBuff: 5,
    foodBuff: 0,
    description: 'Chiseled into basalt bedrock to catch clean monsoon mountain runoff.',
    culturalNote: 'Shivneri and Raigad maintained multi-chamber cisterns to outlast 8-month sieges.',
    icon: '💧',
    preferredTerrain: ['water_catchment', 'plateau_core'],
  },
  granary: {
    type: 'granary',
    name: 'Elevated Granary',
    nativeName: 'Amberkhana',
    cost: { stone: 20, water: 5, food: 0 },
    waterBuff: 0,
    defenceBuff: 10,
    foodBuff: 35,
    description: 'Elevated stone storehouse with ventilated floor to prevent moisture rot.',
    culturalNote: 'Panhala’s Amberkhana stored over 25,000 khandis of grain safe from damp monsoons.',
    icon: '🌾',
    preferredTerrain: ['plateau_core'],
  },
  watchtower: {
    type: 'watchtower',
    name: 'Bastion Watchtower',
    nativeName: 'Burj',
    cost: { stone: 15, water: 5, food: 5 },
    waterBuff: 0,
    defenceBuff: 30,
    foodBuff: 0,
    description: 'Elevated stone tower offering 360-degree surveillance across mountain passes.',
    culturalNote: 'Rajgad’s Padmavati and Suvela Machi bastions commanded panoramic valley approaches.',
    icon: '👁️',
    preferredTerrain: ['cliff_ridge', 'hill_spur'],
  },
  fortified_gate: {
    type: 'fortified_gate',
    name: 'Bastion Gate',
    nativeName: 'Maha Darwaza',
    cost: { stone: 30, water: 5, food: 0 },
    waterBuff: 0,
    defenceBuff: 35,
    foodBuff: 0,
    description: 'Curved entrance with flanking bastions to eliminate direct battering ram angles.',
    culturalNote: 'Gomukhi (cow-mouth) gates forced attacking troops into narrow single-file crossfires.',
    icon: '🚪',
    preferredTerrain: ['entry_pass'],
  },
  rampart_wall: {
    type: 'rampart_wall',
    name: 'Basalt Wall',
    nativeName: 'Tatbandi',
    cost: { stone: 10, water: 0, food: 0 },
    waterBuff: 0,
    defenceBuff: 15,
    foodBuff: 0,
    description: 'Interlocking dry-stone parapet wall following natural cliff contours.',
    culturalNote: 'Engineered without lime mortar in outer rings to absorb seismic and artillery shock.',
    icon: '🧱',
    preferredTerrain: ['cliff_ridge'],
  },
  catchment_canal: {
    type: 'catchment_canal',
    name: 'Catchment Canal',
    nativeName: 'Panyachi Chara',
    cost: { stone: 10, water: 0, food: 0 },
    waterBuff: 20,
    defenceBuff: 0,
    foodBuff: 0,
    description: 'Stone-lined channel guiding surface storm runoff to sedimentation basins.',
    culturalNote: 'Stone gradients naturally filtered coarse debris before water entered reservoirs.',
    icon: '〰️',
    preferredTerrain: ['water_catchment'],
  },
};

export const INITIAL_FORT_RESOURCES: FortResources = {
  stone: 100,
  water: 35,
  food: 30,
  knowledge: 20,
};

export const FORT_CRISIS_EVENTS: FortCrisisEvent[] = [
  {
    id: 'monsoon-deluge',
    name: 'Monsoon Cloudburst',
    description: 'Torrential 15-day Western Ghats rainfall batters the plateau.',
    historicalContext:
      'Without stone cisterns and drainage channels, monsoon deluge causes rampart landslides and water contamination.',
    requirements: { minWaterResilience: 30, minFoodStorage: 20, minDefence: 20 },
    relatedKnowledgeId: 'ck-shivneri-rainwater',
  },
  {
    id: 'siege-blockade',
    name: 'Valley Siege Blockade',
    description: 'Opposing forces cut off the lower mountain pass for 90 days.',
    historicalContext:
      'As Ramchandra Pant Amatya wrote in the Adnyapatra, a fort’s independence hinges entirely on internal grain and water sufficiency.',
    requirements: { minWaterResilience: 40, minFoodStorage: 35, minDefence: 40 },
    relatedKnowledgeId: 'ck-arthashastra-forts',
  },
  {
    id: 'summer-drought',
    name: 'Summer Evaporation Crisis',
    description: 'Scorching 42°C pre-monsoon heat dries shallow surface pools.',
    historicalContext:
      'Deep rock-cut Baolis sheltered beneath basalt escarpments kept water cool and prevented evaporation losses.',
    requirements: { minWaterResilience: 50, minFoodStorage: 25, minDefence: 20 },
    relatedKnowledgeId: 'ck-stepwells-gujarat',
  },
];

export function createDefaultFortGrid(): FortTile[] {
  // 5x5 grid with distinct historical terrain zones
  const grid: FortTile[] = [];
  const terrainLayout: FortTerrainType[][] = [
    ['cliff_ridge', 'cliff_ridge', 'cliff_ridge', 'hill_spur', 'cliff_ridge'],
    ['cliff_ridge', 'plateau_core', 'plateau_core', 'water_catchment', 'cliff_ridge'],
    ['entry_pass', 'plateau_core', 'plateau_core', 'water_catchment', 'cliff_ridge'],
    ['cliff_ridge', 'plateau_core', 'plateau_core', 'plateau_core', 'cliff_ridge'],
    ['cliff_ridge', 'hill_spur', 'cliff_ridge', 'cliff_ridge', 'cliff_ridge'],
  ];

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      grid.push({
        x,
        y,
        terrain: terrainLayout[y][x],
      });
    }
  }
  return grid;
}

export function calculateFortMetrics(grid: FortTile[]): FortMetrics {
  let waterCapacity = 0;
  let foodStorage = 0;
  let defenceRating = 0;
  let canalBonus = 0;
  let baoliCount = 0;

  for (const tile of grid) {
    if (!tile.structure) continue;
    const def = FORT_STRUCTURES[tile.structure];
    if (!def) continue;

    let multiplier = 1.0;
    // Terrain alignment bonus
    if (def.preferredTerrain && def.preferredTerrain.includes(tile.terrain)) {
      multiplier = 1.25;
    }

    waterCapacity += def.waterBuff * multiplier;
    foodStorage += def.foodBuff * multiplier;
    defenceRating += def.defenceBuff * multiplier;

    if (tile.structure === 'catchment_canal') canalBonus += 15;
    if (tile.structure === 'baoli') baoliCount++;
  }

  // Synergies: Baoli + Canal increases water resilience
  const waterResilience = Math.round(waterCapacity + (baoliCount > 0 ? canalBonus : 0));
  const roundedDefence = Math.round(defenceRating);
  const roundedFood = Math.round(foodStorage);

  const overallScore = Math.min(
    100,
    Math.round(waterResilience * 0.4 + roundedDefence * 0.35 + roundedFood * 0.25)
  );

  return {
    waterCapacity: Math.round(waterCapacity),
    foodStorage: roundedFood,
    defenceRating: roundedDefence,
    waterResilience,
    overallScore,
  };
}

export function canPlaceStructure(
  tile: FortTile,
  structureType: FortStructureType,
  resources: FortResources
): { allowed: boolean; reason?: string } {
  if (tile.structure) {
    return { allowed: false, reason: 'Tile is already occupied. Dismantle first.' };
  }

  const def = FORT_STRUCTURES[structureType];
  if (!def) {
    return { allowed: false, reason: 'Unknown structure.' };
  }

  if (resources.stone < def.cost.stone) {
    return { allowed: false, reason: `Insufficient stone! Requires ${def.cost.stone} stone.` };
  }

  if (def.cost.water && resources.water < def.cost.water) {
    return { allowed: false, reason: `Insufficient water! Requires ${def.cost.water} water.` };
  }

  if (def.cost.food && resources.food < def.cost.food) {
    return { allowed: false, reason: `Insufficient grain! Requires ${def.cost.food} food.` };
  }

  return { allowed: true };
}

export function placeStructure(
  grid: FortTile[],
  x: number,
  y: number,
  structureType: FortStructureType,
  resources: FortResources
): { newGrid: FortTile[]; newResources: FortResources } | null {
  const tileIndex = grid.findIndex(t => t.x === x && t.y === y);
  if (tileIndex === -1) return null;

  const tile = grid[tileIndex];
  const check = canPlaceStructure(tile, structureType, resources);
  if (!check.allowed) return null;

  const def = FORT_STRUCTURES[structureType];
  const newGrid = [...grid];
  newGrid[tileIndex] = { ...tile, structure: structureType };

  const newResources: FortResources = {
    stone: resources.stone - def.cost.stone,
    water: resources.water - (def.cost.water || 0),
    food: resources.food - (def.cost.food || 0),
    knowledge: resources.knowledge + 5,
  };

  return { newGrid, newResources };
}

export function removeStructure(
  grid: FortTile[],
  x: number,
  y: number,
  resources: FortResources
): { newGrid: FortTile[]; newResources: FortResources } | null {
  const tileIndex = grid.findIndex(t => t.x === x && t.y === y);
  if (tileIndex === -1) return null;

  const tile = grid[tileIndex];
  if (!tile.structure) return null;

  const def = FORT_STRUCTURES[tile.structure];
  const newGrid = [...grid];
  newGrid[tileIndex] = { ...tile, structure: undefined };

  // Refund 50% stone
  const newResources: FortResources = {
    ...resources,
    stone: resources.stone + Math.floor(def.cost.stone * 0.5),
  };

  return { newGrid, newResources };
}

export function evaluateCrisisEvent(
  metrics: FortMetrics,
  event: FortCrisisEvent
): {
  success: boolean;
  rating: 'optimal' | 'moderate' | 'critical';
  impactSummary: string;
  culturalInsight: string;
} {
  const { minWaterResilience, minFoodStorage, minDefence } = event.requirements;
  const waterMet = metrics.waterResilience >= minWaterResilience;
  const foodMet = metrics.foodStorage >= minFoodStorage;
  const defenceMet = metrics.defenceRating >= minDefence;

  const metCount = [waterMet, foodMet, defenceMet].filter(Boolean).length;

  if (metCount === 3) {
    return {
      success: true,
      rating: 'optimal',
      impactSummary: `Splendid preparation! Your fortress weathered the ${event.name} with complete resilience. Water reserves were full, granaries remained secure, and defensive perimeters repelled incursions.`,
      culturalInsight:
        'This exemplifies the core Maratha and Deccan hill fort design philosophy: an autonomous water catchment system transforms a natural mountain into an impenetrable sanctuary.',
    };
  } else if (metCount === 2) {
    return {
      success: true,
      rating: 'moderate',
      impactSummary: `Your fortress survived the ${event.name}, but critical vulnerabilities emerged. Deficits forced severe emergency rationing upon the garrison.`,
      culturalInsight:
        'Historical sieges documented in Kautilya’s Arthashastra emphasize that partial self-reliance leaves a fortress at the mercy of extended delays.',
    };
  } else {
    return {
      success: false,
      rating: 'critical',
      impactSummary: `Critical vulnerability exposed during ${event.name}. Without adequate water cisterns or grain storage, garrison morale collapsed and the defense was severely compromised.`,
      culturalInsight:
        'As recorded in Ramchandra Pant Amatya’s Adnyapatra: "A fort without internal water is no fort at all." First secure the subterranean water, then erect the walls.',
    };
  }
}
