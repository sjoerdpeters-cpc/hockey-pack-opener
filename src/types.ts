export type Rarity = 'Bronze' | 'Silver' | 'Gold' | 'Elite' | 'Icon' | 'Special';
export type Position = 'GK' | 'DEF' | 'MID' | 'ATT';
export type Gender = 'male' | 'female';
export type TeamType = 'Hoofdklasse' | 'International' | 'Both';

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
  filter?: (p: Player) => boolean;
  rarityBoost?: Partial<Record<Rarity, number>>;
}

export interface CollectedCard extends Player {
  collectedAt: number;
  duplicateOf?: string;
}
