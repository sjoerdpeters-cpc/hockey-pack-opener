import { useMemo } from 'react';
import type { CollectedCard, Club, Gender } from '../types';
import { clubs, getClubInitials } from '../clubs';
import { players } from '../data/dataset';

interface Props {
  collection: CollectedCard[];
  onBack: () => void;
}

interface BadgeInfo {
  club: Club;
  gender: Gender;
  total: number;
  collected: number;
}

export function Challenges({ collection, onBack }: Props) {
  const badges = useMemo<BadgeInfo[]>(() => {
    const collectedIds = new Set(collection.map(c => c.id));

    return clubs
      .flatMap(club =>
        (club.teams ?? []).map((gender): BadgeInfo => {
          const pool = players.filter(p => p.club === club.name && p.gender === gender);
          return {
            club,
            gender,
            total: pool.length,
            collected: pool.filter(p => collectedIds.has(p.id)).length,
          };
        })
      )
      .filter(b => b.total > 0)
      .sort((a, b) => {
        const aComplete = a.collected === a.total;
        const bComplete = b.collected === b.total;
        if (aComplete !== bComplete) return aComplete ? -1 : 1;
        return b.collected / b.total - a.collected / a.total;
      });
  }, [collection]);

  const completedCount = badges.filter(b => b.collected === b.total).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <button onClick={onBack} className="text-white/60 hover:text-white transition-colors text-sm">
          ← Terug
        </button>
        <h2 className="text-2xl font-bold text-white">Uitdagingen</h2>
        <span className="text-white/50 text-sm ml-auto">
          {completedCount} / {badges.length} badges behaald
        </span>
      </div>

      {/* Overall progress */}
      <div className="mb-8 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-700"
          style={{ width: `${badges.length ? (completedCount / badges.length) * 100 : 0}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {badges.map(b => (
          <BadgeCard key={`${b.club.id}-${b.gender}`} badge={b} />
        ))}
      </div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: BadgeInfo }) {
  const { club, gender, total, collected } = badge;
  const isComplete = collected === total;
  const pct = total > 0 ? collected / total : 0;
  const initials = getClubInitials(club);

  // Make sure secondary color contrasts enough to be visible
  const bg = isComplete
    ? `linear-gradient(145deg, ${club.colorPrimary} 0%, ${club.colorSecondary || club.colorPrimary} 100%)`
    : undefined;

  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
        isComplete
          ? 'border-yellow-400/40 bg-yellow-400/5 shadow-lg shadow-yellow-400/10'
          : 'border-white/10 bg-white/5'
      }`}
    >
      {/* Badge circle */}
      <div className="relative mt-1">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-black select-none transition-all duration-500"
          style={
            isComplete
              ? {
                  background: bg,
                  boxShadow: `0 0 28px ${club.colorPrimary}55, 0 0 8px ${club.colorPrimary}33`,
                  color: '#fff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }
              : {
                  background: '#1f2937',
                  color: 'rgba(255,255,255,0.18)',
                }
          }
        >
          {initials}
        </div>

        {isComplete && (
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-yellow-400 text-black text-xs font-black rounded-full flex items-center justify-center shadow-md">
            ✓
          </div>
        )}
      </div>

      {/* Club name + gender */}
      <div className="text-center leading-tight">
        <div className={`text-xs font-bold ${isComplete ? 'text-white' : 'text-white/40'}`}>
          {club.name}
        </div>
        <div className={`text-xs ${isComplete ? 'text-white/60' : 'text-white/25'}`}>
          {gender === 'male' ? 'Heren' : 'Dames'}
        </div>
      </div>

      {/* Progress bar + counter */}
      <div className="w-full">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct * 100}%`,
              background: isComplete ? '#fbbf24' : club.colorPrimary,
            }}
          />
        </div>
        <div className={`text-center text-xs mt-1 tabular-nums ${isComplete ? 'text-yellow-400 font-bold' : 'text-white/30'}`}>
          {collected} / {total}
        </div>
      </div>
    </div>
  );
}
