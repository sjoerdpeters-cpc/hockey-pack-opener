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

  const clubs = useMemo(() => [...new Set(collection.map(c => c.club))].sort(), [collection]);
  const nationalities = useMemo(() => [...new Set(collection.map(c => c.nationality))].sort(), [collection]);

  const filtered = useMemo(() => {
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
      return true;
    });
  }, [collection, filters]);

  const uniqueCount = new Set(collection.map(c => c.id)).size;
  const internationalCount = [...new Set(collection.map(c => c.id))]
    .filter(id => collection.find(c => c.id === id)?.isSeniorInternational).length;

  const allDuplicates = [...sellable];
  const bulkCoins = allDuplicates.reduce((sum, c) => sum + sellPriceFor(c.rarity), 0);

  function handleSellOne(card: CollectedCard) {
    onSell([card]);
  }

  function handleBulkSell() {
    if (!confirmBulk) {
      setConfirmBulk(true);
      return;
    }
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

        {/* Bulk sell */}
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
            {confirmBulk ? (
              'Zeker? Klik om te bevestigen'
            ) : (
              <>
                Verkoop alle dubbelen ({allDuplicates.length})
                <span className="text-yellow-400 font-bold">🪙 {bulkCoins.toLocaleString()}</span>
              </>
            )}
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
      {filtered.length === 0 ? (
        <div className="text-center text-white/40 py-20">
          {collection.length === 0
            ? 'Nog geen kaarten. Open een pack!'
            : 'Geen kaarten gevonden met deze filters.'}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 justify-start">
          {filtered.map((card, i) => {
            const isSellable = sellable.has(card);
            const price = sellPriceFor(card.rarity);
            return (
              <div key={`${card.id}-${card.collectedAt}-${i}`} className="flex flex-col items-center gap-1">
                <PlayerCard player={card} small />
                {isSellable ? (
                  <button
                    onClick={() => handleSellOne(card)}
                    className="w-full text-xs font-semibold text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/20 rounded-lg px-2 py-1 transition-colors"
                  >
                    Verkoop · 🪙 {price.toLocaleString()}
                  </button>
                ) : (
                  <div className="h-6" /> /* spacer to keep grid aligned */
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
