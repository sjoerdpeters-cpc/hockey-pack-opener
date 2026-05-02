import { useState, useMemo } from 'react';
import type { CollectedCard } from '../types';
import { PlayerCard } from './PlayerCard';
import { FilterBar } from './FilterBar';
import type { Filters } from './FilterBar';

interface Props {
  collection: CollectedCard[];
  onBack: () => void;
}

export function Collection({ collection, onBack }: Props) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    gender: 'all',
    position: 'all',
    rarity: 'all',
    club: '',
    nationality: '',
  });

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
      return true;
    });
  }, [collection, filters]);

  const uniqueCount = new Set(collection.map(c => c.id)).size;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-white/60 hover:text-white transition-colors text-sm">
          ← Terug
        </button>
        <h2 className="text-2xl font-bold text-white">Mijn Collectie</h2>
        <div className="text-white/50 text-sm ml-auto">
          {uniqueCount} unieke spelers · {collection.length} totaal
        </div>
      </div>

      <div className="mb-6">
        <FilterBar
          filters={filters}
          clubs={clubs}
          nationalities={nationalities}
          onChange={setFilters}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-white/40 py-20">
          {collection.length === 0
            ? 'Nog geen kaarten. Open een pack!'
            : 'Geen kaarten gevonden met deze filters.'}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-start">
          {filtered.map((card, i) => (
            <div key={`${card.id}-${card.collectedAt}-${i}`} className="relative">
              <PlayerCard player={card} small />
              {card.duplicateOf && (
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  2
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
