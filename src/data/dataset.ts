// Dataset adapter: merges playersBase + playerRatings from v1.6.0
import { playersBase } from './v1.6.0/hockey-pack-opener-project-files/src/data/playersBase';
import { playerRatings } from './v1.6.0/hockey-pack-opener-project-files/src/data/playerRatings';
// playerCountries not included in v1.6.0 — kept from archived v1.5.2 (country metadata is version-independent)
import { playerCountries } from './archive/v1.5.2/hockey-pack-opener-project-files/src/data/playerCountries';
export { datasetMeta } from './v1.6.0/hockey-pack-opener-project-files/src/data/datasetMeta';

import type { EnrichedPlayer, Rarity, Position, Gender } from '../types';

// Traits above this confidence % are shown on the card
export const TRAIT_CONFIDENCE_THRESHOLD = 25;

const VALID_POSITIONS = new Set(['GK', 'DEF', 'MID', 'ATT']);

function mapPosition(raw: string): Position {
  const p = (raw ?? '').toUpperCase();
  if (VALID_POSITIONS.has(p)) return p as Position;
  return 'MID'; // UNKNOWN → fallback
}

function buildRatingsMap() {
  const map = new Map<string, typeof playerRatings[number]>();
  for (const r of playerRatings) map.set(r.playerId, r);
  return map;
}

function mergePlayer(
  base: typeof playersBase[number],
  ratingsMap: Map<string, typeof playerRatings[number]>
): EnrichedPlayer {
  const r = ratingsMap.get(base.id);
  const traitScores = (r?.traitScores ?? []) as EnrichedPlayer['traitScores'];
  const traits = traitScores
    .filter(t => t.confidence >= TRAIT_CONFIDENCE_THRESHOLD)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
    .map(t => t.trait);

  return {
    // Core identity
    id: base.id,
    name: base.name,
    gender: base.gender as Gender,
    nationality: base.nationality,
    club: base.club,
    teamType: 'Hoofdklasse',
    source: base.source,

    // Team
    teamName: base.teamName ?? '',
    team: base.team ?? '',
    teamLabel: base.teamLabel ?? '',
    competition: base.competition ?? '',

    // Position
    fieldPosition: base.fieldPosition ?? 'UNKNOWN',
    position: mapPosition(base.fieldPosition ?? ''),
    isKeeper: base.isKeeper ?? false,
    isCaptain: base.isCaptain ?? false,
    jerseyNumber: typeof base.jerseyNumber === 'number' ? base.jerseyNumber : null,

    // Game data
    rating: r?.rating ?? 60,
    rarity: (r?.rarity ?? 'Bronze') as Rarity,
    traitScores,
    traits,

    // International status
    isSeniorInternational: base.isSeniorInternational ?? false,
    isJongOranje: base.isJongOranje ?? false,
    // isForeignSeniorInternational removed in v1.6.0
    isForeignSeniorInternational: (base as Record<string, unknown>).isForeignSeniorInternational === true,
    internationalStatusSummary: base.internationalStatusSummary ?? '',
    // Caps/goals/portrait/age removed in v1.6.0 — default to null/empty
    officialInternationalCaps: null,
    officialInternationalGoals: null,
    officialInternationalStatsTeam: null,
    portraitUrl: '',
    portraitStatus: 'missing',
    imageUrl: undefined,
    ageYears: null,
    birthDate: '',
  };
}

const ratingsMap = buildRatingsMap();
export const players: EnrichedPlayer[] = playersBase.map(b => mergePlayer(b, ratingsMap));

// Country lookup by ISO code
type CountryEntry = typeof playerCountries[number];
const countryMap = new Map<string, CountryEntry>(
  playerCountries.map(c => [c.code, c])
);

export function getCountry(code: string): CountryEntry | undefined {
  return countryMap.get(code);
}

export function getFlagEmoji(code: string): string {
  return countryMap.get(code)?.flagEmoji ?? '🏳️';
}

export function getFlagPngUrl(code: string): string {
  return countryMap.get(code)?.flagPngUrl ?? '';
}
