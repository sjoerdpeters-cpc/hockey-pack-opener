export type Rarity = 'Bronze' | 'Silver' | 'Gold' | 'Elite' | 'Icon' | 'Special';
export type Position = 'GK' | 'DEF' | 'MID' | 'ATT';
export type Gender = 'male' | 'female';
export type TeamType = 'Hoofdklasse' | 'International' | 'Both';

export interface TraitConfidence {
  trait: string;
  confidence: number;
  basis: string;
  sourceType: string;
  sourceName: string;
  sourceUrl?: string;
  note?: string;
}

// Base type used by pack logic internals
export interface Player {
  id: string;
  name: string;
  gender: Gender;
  nationality: string;
  club: string;
  teamType: TeamType;
  position: Position;
  rating: number;
  rarity: Rarity;
  traits: string[];
  imageUrl?: string;
  source?: string;
}

// Full enriched player from v1.5.2 dataset
export interface EnrichedPlayer extends Player {
  teamName: string;
  team: string;
  teamLabel: string;
  competition: string;
  fieldPosition: string;       // raw value, may be 'UNKNOWN'
  jerseyNumber: number | null;
  isKeeper: boolean;
  isCaptain: boolean;
  traitScores: TraitConfidence[];
  isSeniorInternational: boolean;
  isJongOranje: boolean;
  isForeignSeniorInternational: boolean;
  internationalStatusSummary: string;
  officialInternationalCaps: number | null;
  officialInternationalGoals: number | null;
  officialInternationalStatsTeam: string | null;
  portraitUrl: string;
  portraitStatus: string;
  ageYears: number | null;
  birthDate: string;
}

export type PackType =
  | 'starter'
  | 'hoofdklasse'
  | 'international'
  | 'womens_elite'
  | 'mens_elite'
  | 'goalkeeper'
  | 'derby'
  | 'ultimate';

export interface PackConfig {
  id: PackType;
  name: string;
  description: string;
  cardCount: number;
  cost: number;
  color: string;
  icon: string;
  filter?: (p: EnrichedPlayer) => boolean;
  rarityBoost?: Partial<Record<Rarity, number>>;
}

export interface CollectedCard extends EnrichedPlayer {
  collectedAt: number;
  duplicateOf?: string;
}

export interface Club {
  id: string;
  name: string;
  fullName?: string;
  country: string;
  teams?: Gender[];
  logoUrl?: string;
  colorPrimary: string;
  colorSecondary: string;
}
