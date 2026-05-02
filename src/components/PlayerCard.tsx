import type { EnrichedPlayer, Rarity } from '../types';
import { getClubByName, darkenColor, getClubInitials } from '../clubs';
import { getFlagEmoji, getFlagPngUrl } from '../data/dataset';

// Exact hex border colors per rarity (used as inline borderColor)
const RARITY_BORDER_COLOR: Record<Rarity, string> = {
  Bronze:  '#b45309',
  Silver:  '#94a3b8',
  Gold:    '#facc15',
  Elite:   '#8b5cf6',
  Icon:    '#22d3ee',
  Special: '#ec4899',
};

const RARITY_GLOW: Record<Rarity, string> = {
  Bronze:  '#92400e',
  Silver:  '#94a3b8',
  Gold:    '#facc15',
  Elite:   '#8b5cf6',
  Icon:    '#22d3ee',
  Special: '#ec4899',
};

const RARITY_LABEL: Record<Rarity, string> = {
  Bronze:  'text-amber-500',
  Silver:  'text-slate-300',
  Gold:    'text-yellow-400',
  Elite:   'text-violet-400',
  Icon:    'text-cyan-400',
  Special: 'text-pink-400',
};

const POS_COLOR: Record<string, string> = {
  GK:  'bg-yellow-600',
  DEF: 'bg-blue-600',
  MID: 'bg-green-600',
  ATT: 'bg-red-600',
};

interface Props {
  player: EnrichedPlayer;
  small?: boolean;
}

function IntlBadge({ player, small }: { player: EnrichedPlayer; small: boolean }) {
  const size = small ? 'text-xs' : 'text-xs';
  if (player.isSeniorInternational) return <span className={size} title="Senior international">🌟</span>;
  if (player.isJongOranje) return <span className={size} title="Jong Oranje">🟡</span>;
  if (player.isForeignSeniorInternational) return <span className={size} title="Buitenlands international">🌍</span>;
  return null;
}

function Portrait({ player, size }: { player: EnrichedPlayer; size: number }) {
  const club = getClubByName(player.club);
  const initials = player.name.split(' ').map(w => w[0]).slice(0, 2).join('');

  if (player.portraitUrl) {
    return (
      <img
        src={player.portraitUrl}
        alt={player.name}
        className="rounded-full object-cover border border-white/20"
        style={{ width: size, height: size }}
        onError={(e) => {
          // On broken image: swap to initials div
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
    );
  }

  // Club logo watermark behind initials
  const bgGrad = `radial-gradient(circle, ${darkenColor(club.colorPrimary, 0.4)}, ${darkenColor(club.colorSecondary, 0.25)})`;

  return (
    <div
      className="rounded-full flex items-center justify-center border border-white/10 font-black text-white/70"
      style={{ width: size, height: size, background: bgGrad, fontSize: size * 0.33 }}
    >
      {initials}
    </div>
  );
}

export function PlayerCard({ player, small = false }: Props) {
  const club = getClubByName(player.club);
  const isHighRarity = player.rarity === 'Special' || player.rarity === 'Icon' || player.rarity === 'Elite';
  const flagEmoji = getFlagEmoji(player.nationality);
  const flagPng = getFlagPngUrl(player.nationality);

  // Club color background: start from app dark, blend through club colors
  const hexA = (hex: string, a: number) =>
    hex.replace(/^#/, '') + Math.round(a * 255).toString(16).padStart(2, '0');
  const cardBg = [
    `linear-gradient(160deg,`,
    `#0a0e1a 0%,`,
    `#${hexA(club.colorPrimary, 0.50)} 55%,`,
    `#${hexA(club.colorSecondary || club.colorPrimary, 0.35)} 100%)`,
  ].join(' ');
  const glowColor = RARITY_GLOW[player.rarity];

  const posLabel = player.fieldPosition === 'UNKNOWN' ? '?' : player.position;
  const posClass = POS_COLOR[player.position] ?? 'bg-gray-600';

  return (
    <div
      className={`
        relative rounded-xl flex flex-col items-center overflow-hidden select-none
        ${player.rarity === 'Special' ? 'border-4 card-rainbow' : 'border-2'}
        ${small ? 'w-32 p-2 gap-1' : 'w-52 p-4 gap-2'}
      `}
      style={{
        background: cardBg,
        borderColor: player.rarity !== 'Special' ? RARITY_BORDER_COLOR[player.rarity] : undefined,
        boxShadow: `0 0 18px ${glowColor}55, 0 4px 12px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Shimmer for Elite+ */}
      {isHighRarity && <div className="absolute inset-0 card-shimmer pointer-events-none rounded-xl" />}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20 rounded-xl pointer-events-none" />

      {/* Club color stripe at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ background: `linear-gradient(90deg, ${club.colorPrimary}, ${club.colorSecondary})` }}
      />

      {/* Rating */}
      <div className={`
        relative z-10 absolute top-2 left-2 font-black leading-none
        ${small ? 'text-xl px-1' : 'text-3xl px-1'}
        ${RARITY_LABEL[player.rarity]}
      `}
        style={{ textShadow: `0 0 8px ${glowColor}` }}
      >
        {player.rating}
      </div>

      {/* Position badge */}
      <div className={`
        relative z-10 absolute top-2 right-2 rounded font-bold text-white text-xs
        ${small ? 'px-1' : 'px-1.5 py-0.5'}
        ${posClass}
      `}>
        {posLabel}
      </div>

      {/* Portrait / Avatar */}
      <div className={`relative z-10 ${small ? 'mt-4' : 'mt-6'}`}>
        <Portrait player={player} size={small ? 44 : 88} />
        {/* Broken-image fallback (hidden by default, shown by onError) */}
        <div
          className="rounded-full items-center justify-center border border-white/10 font-black text-white/70 hidden"
          style={{ width: small ? 44 : 88, height: small ? 44 : 88, fontSize: small ? 14 : 28 }}
        >
          {player.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
        </div>
      </div>

      {/* Name */}
      <div className={`relative z-10 font-bold text-white text-center leading-tight ${small ? 'text-xs' : 'text-sm'}`}>
        {player.name}
        {player.isCaptain && <span className="ml-1 text-yellow-400 text-xs">©</span>}
      </div>

      {/* Club + flag + international badge */}
      <div className="relative z-10 flex items-center gap-1 text-white/60 text-xs">
        {flagPng
          ? <img src={flagPng} alt={player.nationality} className="w-4 h-3 object-cover rounded-sm" />
          : <span>{flagEmoji}</span>
        }
        <span className={`truncate ${small ? 'max-w-16' : 'max-w-24'}`}>{player.club}</span>
        <IntlBadge player={player} small={small} />
      </div>

      {/* Team label (full card only) */}
      {!small && player.teamLabel && (
        <div className="relative z-10 text-white/40 text-xs">{player.teamLabel}</div>
      )}

      {/* Rarity */}
      <div className={`relative z-10 font-semibold uppercase tracking-wider text-xs ${RARITY_LABEL[player.rarity]}`}>
        {player.rarity}
      </div>

      {/* Traits (full card only) */}
      {!small && player.traits.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1 justify-center">
          {player.traits.slice(0, 3).map(t => (
            <span key={t} className="bg-white/10 text-white/70 text-xs rounded px-1.5 py-0.5">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Caps (full card only, only if senior international) */}
      {!small && player.isSeniorInternational && player.officialInternationalCaps !== null && (
        <div className="relative z-10 flex gap-2 text-xs text-white/50">
          <span>🌟 {player.officialInternationalCaps} caps</span>
          {player.officialInternationalGoals !== null && (
            <span>· {player.officialInternationalGoals} goals</span>
          )}
        </div>
      )}

      {/* Club initials watermark (full card only, no logo URL) */}
      {!small && !club.logoUrl && club.name && (
        <div
          className="absolute bottom-6 right-2 font-black opacity-10 text-lg pointer-events-none z-0"
          style={{ color: club.colorPrimary }}
        >
          {getClubInitials(club)}
        </div>
      )}

      {/* Club logo (if available) */}
      {!small && club.logoUrl && (
        <img
          src={club.logoUrl}
          alt={club.name}
          className="absolute bottom-6 right-2 w-6 h-6 object-contain opacity-40 z-0"
        />
      )}

      {/* Gender indicator */}
      <div className="relative z-10 absolute bottom-1.5 right-2 text-white/20 text-xs">
        {player.gender === 'female' ? '♀' : '♂'}
      </div>
    </div>
  );
}
