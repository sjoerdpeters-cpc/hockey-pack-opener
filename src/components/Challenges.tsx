import { useMemo, useState } from 'react';
import type { CollectedCard, Club, Gender, EnrichedPlayer } from '../types';
import { clubs, getClubInitials } from '../clubs';
import { players, getCountry } from '../data/dataset';
import { PlayerCard } from './PlayerCard';

interface Props {
  collection: CollectedCard[];
  onBack: () => void;
}

// ── Detail modal ─────────────────────────────────────────────────────────────

interface DetailInfo {
  title: string;
  subtitle: string;
  pool: EnrichedPlayer[];
}

// ── Club badges ──────────────────────────────────────────────────────────────

interface ClubBadge {
  club: Club;
  gender: Gender;
  total: number;
  collected: number;
  pool: EnrichedPlayer[];
}

function useClubBadges(collection: CollectedCard[]): ClubBadge[] {
  return useMemo(() => {
    const ids = new Set(collection.map(c => c.id));
    return clubs
      .flatMap(club =>
        (club.teams ?? []).map((gender): ClubBadge => {
          const pool = players.filter(p => p.club === club.name && p.gender === gender);
          return { club, gender, total: pool.length, collected: pool.filter(p => ids.has(p.id)).length, pool };
        })
      )
      .filter(b => b.total > 0)
      .sort((a, b) => {
        const n = a.club.name.localeCompare(b.club.name, 'nl');
        return n !== 0 ? n : (a.gender === 'male' ? -1 : 1);
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
  pool: EnrichedPlayer[];
}

const NAT_CODES = ['NL', 'DE', 'BE'] as const;
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
        colorA, colorB,
        total: pool.length,
        collected: pool.filter(p => ids.has(p.id)).length,
        pool,
      };
    }).filter(b => b.total > 0);
  }, [collection]);
}

// ── Icons badge ──────────────────────────────────────────────────────────────

interface IconsBadge { total: number; collected: number; pool: EnrichedPlayer[] }

function useIconsBadge(collection: CollectedCard[]): IconsBadge {
  return useMemo(() => {
    const ids = new Set(collection.map(c => c.id));
    const pool = players.filter(p => p.rarity === 'Icon');
    return { total: pool.length, collected: pool.filter(p => ids.has(p.id)).length, pool };
  }, [collection]);
}

// ── Main component ───────────────────────────────────────────────────────────

export function Challenges({ collection, onBack }: Props) {
  const clubBadges = useClubBadges(collection);
  const natBadges  = useNatBadges(collection);
  const icons      = useIconsBadge(collection);
  const [detail, setDetail] = useState<DetailInfo | null>(null);

  const collectedIds = useMemo(() => new Set(collection.map(c => c.id)), [collection]);

  const totalBadges = clubBadges.length + natBadges.length + 1;
  const completedBadges =
    clubBadges.filter(b => b.collected === b.total).length +
    natBadges.filter(b => b.collected === b.total).length +
    (icons.collected === icons.total && icons.total > 0 ? 1 : 0);

  function openClub(b: ClubBadge) {
    setDetail({
      title: `${b.club.name} ${b.gender === 'male' ? 'Heren' : 'Dames'}`,
      subtitle: `${b.collected} / ${b.total} spelers`,
      pool: b.pool,
    });
  }
  function openNat(b: NatBadge) {
    setDetail({ title: b.label, subtitle: `${b.collected} / ${b.total} spelers`, pool: b.pool });
  }
  function openIcons() {
    setDetail({ title: 'Alle Iconen', subtitle: `${icons.collected} / ${icons.total} iconen`, pool: icons.pool });
  }

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

      <Section title="Clubteams">
        {clubBadges.map(b => (
          <ClubBadgeCard key={`${b.club.id}-${b.gender}`} badge={b} onClick={() => openClub(b)} />
        ))}
      </Section>

      <Section title="Landen">
        {natBadges.map(b => (
          <NatBadgeCard key={b.code} badge={b} onClick={() => openNat(b)} />
        ))}
      </Section>

      <Section title="Legenden">
        <IconsBadgeCard badge={icons} onClick={openIcons} />
      </Section>

      {detail && (
        <DetailModal
          info={detail}
          collectedIds={collectedIds}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}

// ── Detail modal ─────────────────────────────────────────────────────────────

function DetailModal({
  info,
  collectedIds,
  onClose,
}: {
  info: DetailInfo;
  collectedIds: Set<string>;
  onClose: () => void;
}) {
  const collected = info.pool
    .filter(p => collectedIds.has(p.id))
    .sort((a, b) => b.rating - a.rating);
  const missing = info.pool
    .filter(p => !collectedIds.has(p.id))
    .sort((a, b) => b.rating - a.rating);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0d1525] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{info.title}</h3>
            <p className="text-sm text-white/40">{info.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-2xl leading-none transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-5 flex flex-col gap-8">
          {collected.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-green-400/80 uppercase tracking-widest mb-4">
                Jouw kaarten ({collected.length})
              </h4>
              <div className="flex flex-wrap gap-3">
                {collected.map(p => (
                  <PlayerCard key={p.id} player={p} small />
                ))}
              </div>
            </div>
          )}

          {missing.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-4">
                Nog te verzamelen ({missing.length})
              </h4>
              <div className="flex flex-wrap gap-3">
                {missing.map(p => (
                  <MissingCard key={p.id} player={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Grayed-out placeholder for cards the user doesn't have yet
function MissingCard({ player }: { player: EnrichedPlayer }) {
  return (
    <div className="w-32 rounded-xl border border-white/8 bg-white/4 p-2 flex flex-col items-center gap-1.5 select-none">
      {/* Avatar ghost */}
      <div className="w-11 h-11 rounded-full bg-white/8 flex items-center justify-center mt-1">
        <span className="text-white/15 text-lg">?</span>
      </div>

      {/* Name */}
      <div className="text-xs font-medium text-white/25 text-center leading-tight line-clamp-2 px-1">
        {player.name}
      </div>
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

// ── Shared badge pieces ───────────────────────────────────────────────────────

function BadgeShell({ isComplete, onClick, children }: { isComplete: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 w-full text-left cursor-pointer
        hover:scale-105 active:scale-95
        ${isComplete
          ? 'border-yellow-400/40 bg-yellow-400/5 shadow-lg shadow-yellow-400/10 hover:border-yellow-400/60'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
        }`}
    >
      {children}
    </button>
  );
}

function ProgressRow({ collected, total, isComplete, color }: { collected: number; total: number; isComplete: boolean; color: string }) {
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

function CheckMark() {
  return (
    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-yellow-400 text-black text-xs font-black rounded-full flex items-center justify-center shadow-md">
      ✓
    </div>
  );
}

// ── Club badge card ──────────────────────────────────────────────────────────

function ClubBadgeCard({ badge, onClick }: { badge: ClubBadge; onClick: () => void }) {
  const { club, gender, total, collected } = badge;
  const isComplete = collected === total;

  return (
    <BadgeShell isComplete={isComplete} onClick={onClick}>
      <div className="relative mt-1">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-black select-none transition-all duration-500"
          style={isComplete
            ? { background: `linear-gradient(145deg, ${club.colorPrimary}, ${club.colorSecondary || club.colorPrimary})`, boxShadow: `0 0 28px ${club.colorPrimary}55`, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }
            : { background: '#1f2937', color: 'rgba(255,255,255,0.18)' }}
        >
          {getClubInitials(club)}
        </div>
        {isComplete && <CheckMark />}
      </div>
      <div className="text-center leading-tight">
        <div className={`text-xs font-bold ${isComplete ? 'text-white' : 'text-white/40'}`}>{club.name}</div>
        <div className={`text-xs ${isComplete ? 'text-white/60' : 'text-white/25'}`}>{gender === 'male' ? 'Heren' : 'Dames'}</div>
      </div>
      <ProgressRow collected={collected} total={total} isComplete={isComplete} color={club.colorPrimary} />
    </BadgeShell>
  );
}

// ── Nationality badge card ────────────────────────────────────────────────────

function NatBadgeCard({ badge, onClick }: { badge: NatBadge; onClick: () => void }) {
  const { label, flagEmoji, flagPngUrl, colorA, colorB, total, collected } = badge;
  const isComplete = collected === total;

  return (
    <BadgeShell isComplete={isComplete} onClick={onClick}>
      <div className="relative mt-1">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl select-none transition-all duration-500"
          style={isComplete
            ? { background: `linear-gradient(145deg, ${colorA}, ${colorB})`, boxShadow: `0 0 28px ${colorA}55` }
            : { background: '#1f2937', filter: 'grayscale(1) opacity(0.4)' }}
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

// ── Icons badge card ──────────────────────────────────────────────────────────

function IconsBadgeCard({ badge, onClick }: { badge: IconsBadge; onClick: () => void }) {
  const { total, collected } = badge;
  const isComplete = total > 0 && collected === total;

  return (
    <BadgeShell isComplete={isComplete} onClick={onClick}>
      <div className="relative mt-1">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl select-none transition-all duration-500"
          style={isComplete
            ? { background: 'linear-gradient(145deg, #0ea5e9, #22d3ee)', boxShadow: '0 0 28px #22d3ee55' }
            : { background: '#1f2937', filter: 'grayscale(1) opacity(0.4)' }}
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
