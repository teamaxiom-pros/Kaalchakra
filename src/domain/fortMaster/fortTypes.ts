export type FortTerrainType = 'plateau_core' | 'cliff_ridge' | 'water_catchment' | 'hill_spur' | 'entry_pass';

export type FortStructureType =
  | 'baoli'
  | 'granary'
  | 'watchtower'
  | 'fortified_gate'
  | 'rampart_wall'
  | 'catchment_canal';

export interface FortStructureDef {
  type: FortStructureType;
  name: string;
  nativeName: string;
  cost: { stone: number; water?: number; food?: number };
  waterBuff: number;
  defenceBuff: number;
  foodBuff: number;
  description: string;
  culturalNote: string;
  icon: string;
  preferredTerrain?: FortTerrainType[];
}

export interface FortTile {
  x: number;
  y: number;
  terrain: FortTerrainType;
  structure?: FortStructureType;
}

export interface FortResources {
  stone: number;
  water: number;
  food: number;
  knowledge: number;
}

export interface FortMetrics {
  waterCapacity: number;
  foodStorage: number;
  defenceRating: number;
  waterResilience: number;
  overallScore: number;
}

export interface FortCrisisEvent {
  id: string;
  name: string;
  description: string;
  historicalContext: string;
  requirements: {
    minWaterResilience: number;
    minFoodStorage: number;
    minDefence: number;
  };
  relatedKnowledgeId: string;
}
