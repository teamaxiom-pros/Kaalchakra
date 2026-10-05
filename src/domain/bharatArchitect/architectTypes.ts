export type SettlementComponentType =
  | 'residential_block'
  | 'paved_road'
  | 'covered_drain'
  | 'water_reservoir'
  | 'civic_granary'
  | 'great_bath';

export interface SettlementComponentDef {
  type: SettlementComponentType;
  name: string;
  nativeName: string;
  cost: { bricks: number; timber: number };
  description: string;
  culturalNote: string;
  icon: string;
}

export interface SettlementTile {
  x: number;
  y: number;
  component?: SettlementComponentType;
}

export interface SettlementResources {
  bricks: number;
  timber: number;
  labour: number;
}

export interface SettlementEvaluation {
  roadAccessibilityScore: number; // 0 - 100
  sanitationScore: number;        // 0 - 100
  floodResilienceScore: number;   // 0 - 100
  civicBalanceScore: number;      // 0 - 100
  overallScore: number;           // 0 - 100
  houseCount: number;
  connectedDrainCount: number;
  connectedRoadCount: number;
  summary: string;
}
