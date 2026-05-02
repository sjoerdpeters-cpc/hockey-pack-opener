import { useMemo } from 'react';
import type { CollectedCard, Club, Gender } from '../types';
import { clubs, getClubInitials } from '../clubs';
import { players, getCountry } from '../data/dataset';

interface Props {
  collection: CollectedCard[];
  onBack: () => void;
}

// ── Club badges ──────────────────────────────────────────────────────────────

interface ClubBadge {
  club: Club;
  gender: Gender;
  total: number;
  collected: number;
}

function useClubBadges(collection: CollectedCard[]): ClubBadge[] {
  return useMemo(() => {
    const ids = new Set(collection.map(c => c.id));
    return clubs
      .flatMap(club =>
        (club.teams ?? []).map((gender): ClubBadge => {
          const pool = players.filter(p => p.club === club.name && p.gender === gender);
          return { club, gender, total: pool.length, collected: pool.filter(p => ids.has(p.id)).length };
        })
      )
      .filter(b => b.total > 0)
      .sort((a, b) => {
        const name = a.club.name.localeCompare(b.club.name, 'nl');
        if (name !== 0) return name;
        return a.gender === 'male' ? -1 : 1;
      });
  }, [collection]);
}

// ── Nationality badges ───────────────────────────────────────────────────────

interface NatBadge {
  code: string;
  label: string;
  flagEmoji: string;
  flagPngUrl: string;
  colorA: string;
  colorB: string;
  total: number;
  collected: number;
}

const NAT_CODES = ['NL', 'DE', 'BE'] as const;

// Rough flag-inspired duotone colors for each country
const NAT_COLORS: Record<string, [string, string]> = {
  NL: ['#AE1C28', '#21468B'],
  DE: ['#000000', '#DD0000'],
  BE: ['#000000', '#FAE042'],
};

function useNatBadges(collection: CollectedCard[]): NatBadge[] {
  return useMemo(() => {
    const ids = new Set(collection.map(c => c.id));
    return NAT_CODES.map(code => {
      const country = getCountry(code);
      const pool = players.filter(p => p.nationality === code);
      const [colorA, colorB] = NAT_COLORS[code] ?? ['#334155', '#1e40af'];
      return {
        code,
        label: country?.nameNl ?? code,
        flagEmoji: country?.flagEmoji ?? '🏳️',
        flagPngUrl: country?.flagPngUrl ?? '',
        colorA,
        colorB,
        total: pool.length,
        collected: pool.filter(p => ids.has(p.id)).length,
      };
    }).filter(b => b.total > 0);
  }, [collection]);
}

// ── Icons badge ──────────────────────────────────────────────────────────────

interface IconsBadge {
  total: number;
  collected: number;
}

function useIconsBadge(collection: CollectedCard[]): IconsBadge {
  return useMemo(() => {
    const ids = new Set(collection.map(c => c.id));
    const pool = players.filter(p => p.rarity === 'Icon');
    return { total: pool.length, collected: pool.filter(p => ids.has(p.id)).length };
  }, [collection]);
}

// ── Main component ───────────────────────────────────────────────────────────

export function Challenges({ collection, onBack }: Props) {
  const clubBadges = useClubBadges(collection);
  const natBadges = useNatBadges(collection);
  const icons = useIconsBadge(collection);

  const totalBadges = clubBadges.length + natBadges.length + 1;
  const completedBadges =
    clubBadges.filter(b => b.collected === b.total).length +
    natBadges.filter(b => b.collected === b.total).length +
    (icons.collected === icons.total && icons.total > 0 ? 1 : 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <button onClick={onBack} className="text-white/60 hover:text-white transition-colors text-sm">
          ← Terug
        </button>
        <h2 className="text-2xl font-bold text-white">Uitdagingen</h2>
        <span className="text-white/50 text-sm ml-auto">{completedBadges} / {totalBadges} behaald</span>
      </div>

      {/* Overall progress */}
      <div className="mb-8 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-700"
          style={{ width: `${totalBadges ? (completedBadges / totalBadges) * 100 : 0}%` }}
        />
      </div>

      {/* Club badges */}
      <Section title="Clubteams">
        {clubBadges.map(b => (
          <ClubBadgeCard key={`${b.club.id}-${b.gender}`} badge={b} />
        ))}
      </Section>

      {/* Nationality badges */}
      <Section title="Landen">
        {natBadges.map(b => (
          <NatBadgeCard key={b.code} badge={b} />
        ))}
      </Section>

      {/* Icons badge */}
      <Section title="Legenden">
        <IconsBadgeCard badge={icons} />
      </Section>
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {children}
      </div>
    </div>
  );
}

// ── Badge shell ──────────────────────────────────────────────────────────────

function BadgeShell({
  isComplete,
  children,
}: {
  isComplete: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
        isComplete
          ? 'border-yellow-400/40 bg-yellow-400/5 shadow-lg shadow-yellow-400/10'
          : 'border-white/10 bg-white/5'
      }`}
    >
      {children}
    </div>
  );
}

function ProgressRow({
  collected,
  total,
  isComplete,
  color,
}: {
  collected: number;
  total: number;
  isComplete: boolean;
  color: string;
}) {
  return (
    <div className="w-full">
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(collected / total) * 100}%`, background: isComplete ? '#fbbf24' : color }}
        />
      </div>
      <div className={`text-center text-xs mt-1 tabular-nums ${isComplete ? 'text-yellow-400 font-bold' : 'text-white/30'}`}>
        {collected} / {total}
      </div>
    </div>
  );
}

// ── Club badge card ──────────────────────────────────────────────────────────

function ClubBadgeCard({ badge }: { badge: ClubBadge }) {
  const { club, gender, total, collected } = badge;
  const isComplete = collected === total;
  const initials = getClubInitials(club);

  return (
    <BadgeShell isComplete={isComplete}>
      <div className="relative mt-1">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-black select-none transition-all duration-500"
          style={
            isComplete
              ? {
                  background: `linear-gradient(145deg, ${club.colorPrimary}, ${club.colorSecondary || club.colorPrimary})`,
                  boxShadow: `0 0 28px ${club.colorPrimary}55, 0 0 8px ${club.colorPrimary}33`,
                  color: '#fff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }
              : { background: '#1f2937', color: 'rgba(255,255,255,0.18)' }
          }
        >
          {initials}
        </div>
        {isComplete && <CheckMark />}
      </div>

      <div className="text-center leading-tight">
        <div className={`text-xs font-bold ${isComplete ? 'text-white' : 'text-white/40'}`}>{club.name}</div>
        <div className={`text-xs ${isComplete ? 'text-white/60' : 'text-white/25'}`}>
          {gender === 'male' ? 'Heren' : 'Dames'}
        </div>
      </div>

      <ProgressRow collected={collected} total={total} isComplete={isComplete} color={club.colorPrimary} />
    </BadgeShell>
  );
}

// ── Nationality badge card ───────────────────────────────────────────────────

function NatBadgeCard({ badge }: { badge: NatBadge }) {
  const { label, flagEmoji, flagPngUrl, colorA, colorB, total, collected } = badge;
  const isComplete = collected === total;

  return (
    <BadgeShell isComplete={isComplete}>
      <div className="relative mt-1">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl select-none transition-all duration-500"
          style={
            isComplete
              ? {
                  background: `linear-gradient(145deg, ${colorA}, ${colorB})`,
                  boxShadow: `0 0 28px ${colorA}55`,
                }
              : { background: '#1f2937', filter: 'grayscale(1) opacity(0.4)' }
          }
        >
          {flagPngUrl
            ? <img src={flagPngUrl} alt={label} className="w-10 h-7 object-cover rounded shadow" />
            : flagEmoji}
        </div>
        {isComplete && <CheckMark />}
      </div>

      <div className="text-center leading-tight">
        <div className={`text-xs font-bold ${isComplete ? 'text-white' : 'text-white/40'}`}>{label}</div>
        <div className={`text-xs ${isComplete ? 'text-white/60' : 'text-white/25'}`}>Alle spelers</div>
      </div>

      <ProgressRow collected={collected} total={total} isComplete={isComplete} color={colorA} />
    </BadgeShell>
  );
}

// ── Icons badge card ─────────────────────────────────────────────────────────

function IconsBadgeCard({ badge }: { badge: IconsBadge }) {
  const { total, collected } = badge;
  const isComplete = total > 0 && collected === total;

  return (
    <BadgeShell isComplete={isComplete}>
      <div className="relative mt-1">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl select-none transition-all duration-500"
          style={
            isComplete
              ? {
                  background: 'linear-gradient(145deg, #0ea5e9, #22d3ee)',
                  boxShadow: '0 0 28px #22d3ee55',
                }
              : { background: '#1f2937', filter: 'grayscale(1) opacity(0.4)' }
          }
        >
          👑
        </div>
        {isComplete && <CheckMark />}
      </div>

      <div className="text-center leading-tight">
        <div className={`text-xs font-bold ${isComplete ? 'text-white' : 'text-white/40'}`}>Alle Iconen</div>
        <div className={`text-xs ${isComplete ? 'text-white/60' : 'text-white/25'}`}>Icon kaarten</div>
      </div>

      <ProgressRow collected={collected} total={total} isComplete={isComplete} color="#22d3ee" />
    </BadgeShell>
  );
}

// ── Shared ───────────────────────────────────────────────────────────────────

function CheckMark() {
  return (
    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-yellow-400 text-black text-xs font-black rounded-full flex items-center justify-center shadow-md">
      ✓
    </div>
  );
}
