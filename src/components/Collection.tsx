import { useState, useMemo } from 'react';
import type { CollectedCard } from '../types';
import { PlayerCard } from './PlayerCard';
import { FilterBar, DEFAULT_FILTERS } from './FilterBar';
import type { Filters } from './FilterBar';
import { getSellableDuplicates, sellPriceFor } from '../lib/packLogic';

interface Props {
  collection: CollectedCard[];
  onBack: () => void;
  onSell: (cards: CollectedCard[]) => void;
}

export function Collection({ collection, onBack, onSell }: Props) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const sellable = useMemo(() => getSellableDuplicates(collection), [collection]);

  // How many copies of each player the user owns (across the full collection)
  const countMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of collection) map.set(c.id, (map.get(c.id) ?? 0) + 1);
    return map;
  }, [collection]);

  const clubs = useMemo(() => [...new Set(collection.map(c => c.club))].sort(), [collection]);
  const nationalities = useMemo(() => [...new Set(collection.map(c => c.nationality))].sort(), [collection]);

  // Filtered, then deduplicated: show each player once
  const displayCards = useMemo(() => {
    const seen = new Set<string>();
    return collection.filter(c => {
      if (filters.search && !c.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.gender !== 'all' && c.gender !== filters.gender) return false;
      if (filters.position !== 'all' && c.position !== filters.position) return false;
      if (filters.rarity !== 'all' && c.rarity !== filters.rarity) return false;
      if (filters.club && c.club !== filters.club) return false;
      if (filters.nationality && c.nationality !== filters.nationality) return false;
      if (filters.isSeniorInternational !== 'all' && c.isSeniorInternational !== filters.isSeniorInternational) return false;
      if (filters.isJongOranje !== 'all' && c.isJongOranje !== filters.isJongOranje) return false;
      if (filters.isForeignSeniorInternational !== 'all' && c.isForeignSeniorInternational !== filters.isForeignSeniorInternational) return false;
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [collection, filters]);

  // Find one sellable duplicate for a given player id
  const sellableFor = (id: string): CollectedCard | undefined =>
    [...sellable].find(c => c.id === id);

  const uniqueCount = new Set(collection.map(c => c.id)).size;
  const internationalCount = [...new Set(collection.map(c => c.id))]
    .filter(id => collection.find(c => c.id === id)?.isSeniorInternational).length;

  const allDuplicates = [...sellable];
  const bulkCoins = allDuplicates.reduce((sum, c) => sum + sellPriceFor(c.rarity), 0);

  function handleBulkSell() {
    if (!confirmBulk) { setConfirmBulk(true); return; }
    setConfirmBulk(false);
    onSell(allDuplicates);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <button onClick={onBack} className="text-white/60 hover:text-white transition-colors text-sm">
          ← Terug
        </button>
        <h2 className="text-2xl font-bold text-white">Mijn Collectie</h2>
        <div className="flex gap-3 text-sm">
          <span className="text-white/50">{uniqueCount} uniek</span>
          <span className="text-white/30">·</span>
          <span className="text-white/50">{collection.length} totaal</span>
          {internationalCount > 0 && (
            <>
              <span className="text-white/30">·</span>
              <span className="text-yellow-400/70">🌟 {internationalCount} int'ls</span>
            </>
          )}
        </div>

        {allDuplicates.length > 0 && (
          <button
            onClick={handleBulkSell}
            onBlur={() => setConfirmBulk(false)}
            className={`ml-auto flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              confirmBulk
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30'
            }`}
          >
            {confirmBulk
              ? 'Zeker? Klik om te bevestigen'
              : <>Verkoop alle dubbelen ({allDuplicates.length}) <span className="text-yellow-400 font-bold">🪙 {bulkCoins.toLocaleString()}</span></>
            }
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          filters={filters}
          clubs={clubs}
          nationalities={nationalities}
          onChange={(f) => { setFilters(f); setConfirmBulk(false); }}
        />
      </div>

      {/* Cards */}
      {displayCards.length === 0 ? (
        <div className="text-center text-white/40 py-20">
          {collection.length === 0
            ? 'Nog geen kaarten. Open een pack!'
            : 'Geen kaarten gevonden met deze filters.'}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 justify-start">
          {displayCards.map((card) => {
            const count = countMap.get(card.id) ?? 1;
            const dup = sellableFor(card.id);
            const price = dup ? sellPriceFor(dup.rarity) : 0;
            return (
              <div key={card.id} className="flex flex-col items-center gap-1">
                <div className="relative">
                  <PlayerCard player={card} small />
                  {count > 1 && (
                    <div className="absolute -top-1.5 -left-1.5 min-w-5 h-5 px-1 bg-orange-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg shadow-black/40">
                      {count}
                    </div>
                  )}
                </div>
                {dup ? (
                  <button
                    onClick={() => onSell([dup])}
                    className="w-full text-xs font-semibold text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/20 rounded-lg px-2 py-1 transition-colors"
                  >
                    Verkoop 1 · 🪙 {price.toLocaleString()}
                  </button>
                ) : (
                  <div className="h-6" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
