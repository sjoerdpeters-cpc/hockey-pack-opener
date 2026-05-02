import type { EnrichedPlayer, Rarity, PackConfig, CollectedCard } from '../types';
import { BASE_ODDS } from '../data/packs';
import { players } from '../data/dataset';

function weightedRarity(boost?: Partial<Record<Rarity, number>>): Rarity {
  const odds = { ...BASE_ODDS, ...boost };
  const total = Object.values(odds).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [rarity, weight] of Object.entries(odds) as [Rarity, number][]) {
    r -= weight;
    if (r <= 0) return rarity;
  }
  return 'Bronze';
}

export function openPack(pack: PackConfig): EnrichedPlayer[] {
  const pool = pack.filter ? players.filter(pack.filter) : players;
  if (pool.length === 0) return [];

  const drawn: EnrichedPlayer[] = [];

  for (let i = 0; i < pack.cardCount; i++) {
    const targetRarity = weightedRarity(pack.rarityBoost);
    const byRarity = pool.filter((p) => p.rarity === targetRarity);
    const source = byRarity.length > 0 ? byRarity : pool;
    const pick = source[Math.floor(Math.random() * source.length)];
    drawn.push(pick);
  }

  return drawn;
}

const STORAGE_KEY = 'hpo_collection';

export function loadCollection(): CollectedCard[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveToCollection(newCards: EnrichedPlayer[], existing: CollectedCard[]): CollectedCard[] {
  const existingIds = new Set(existing.map((c) => c.id));
  const updated = [...existing];
  for (const card of newCards) {
    const collected: CollectedCard = {
      ...card,
      collectedAt: Date.now(),
      duplicateOf: existingIds.has(card.id) ? card.id : undefined,
    };
    existingIds.add(card.id);
    updated.push(collected);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function loadCoins(): number {
  return parseInt(localStorage.getItem('hpo_coins') ?? '1500', 10);
}

export function saveCoins(coins: number) {
  localStorage.setItem('hpo_coins', String(coins));
}
