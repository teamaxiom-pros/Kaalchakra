export type CulturalDomain =
  | 'architecture'
  | 'defence'
  | 'water-management'
  | 'trade'
  | 'heritage'
  | 'engineering'
  | 'language';

export type CulturalRegion =
  | 'Western India (Maharashtra / Gujarat)'
  | 'Northern India (Indus / Gangetic)'
  | 'Southern India (Chola / Deccan)'
  | 'Central & Eastern India'
  | 'Pan-Indian';

export type HistoricalEra =
  | 'Harappan Civilization (c. 2600 – 1900 BCE)'
  | 'Mauryan & Early Historic (c. 320 – 180 BCE)'
  | 'Classical & Deccan Empires (c. 300 – 1100 CE)'
  | 'Medieval Fortresses & Trade (c. 1200 – 1700 CE)';

export interface CulturalKnowledge {
  id: string;
  title: string;
  subtitle?: string;
  region: CulturalRegion;
  era: HistoricalEra;
  domain: CulturalDomain[];
  summary: string;
  significance: string;
  sourceName: string;
  sourceUrl: string;
  relatedExperiences: string[];
  keyQuote?: string;
  practicalInsight?: string;
}
