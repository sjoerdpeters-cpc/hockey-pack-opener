import { playersBase } from '../src/data/playersBase';
import { playerRatings } from '../src/data/playerRatings';

const errors: string[] = [];

const ids = new Set<string>();
for (const p of playersBase) {
  if (ids.has(p.id)) errors.push(`Duplicate player id: ${p.id}`);
  ids.add(p.id);
  if (!p.name) errors.push(`Missing name for ${p.id}`);
  if (!p.club) errors.push(`Missing club for ${p.id}`);
  if (!['male', 'female'].includes(p.gender)) errors.push(`Invalid gender for ${p.id}`);
  if (!['GK', 'DEF', 'MID', 'ATT', 'UNKNOWN'].includes(p.fieldPosition)) errors.push(`Invalid fieldPosition for ${p.id}`);
  if (!p.source || !p.sourceSeason || !p.lastChecked) errors.push(`Missing source fields for ${p.id}`);
  if (p.verified !== true || p.dataStatus !== 'verified') errors.push(`Player should be verified from KNHB source: ${p.id}`);
}

for (const r of playerRatings) {
  if (!ids.has(r.playerId)) errors.push(`Rating references unknown playerId: ${r.playerId}`);
  if (r.rating < 40 || r.rating > 99) errors.push(`Rating out of range for ${r.playerId}: ${r.rating}`);
  const expected = r.rating >= 93 ? 'Icon' : r.rating >= 85 ? 'Elite' : r.rating >= 75 ? 'Gold' : r.rating >= 65 ? 'Silver' : 'Bronze';
  if (r.rarity !== expected) errors.push(`Rarity mismatch for ${r.playerId}: ${r.rarity}, expected ${expected}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`OK: ${playersBase.length} players and ${playerRatings.length} ratings validated.`);
