import type { Player, Rarity } from '../types';

const FLAG: Record<string, string> = {
  NL: '🇳🇱',
  DE: '🇩🇪',
  ES: '🇪🇸',
};

const RARITY_STYLES: Record<Rarity, string> = {
  Bronze:  'border-amber-700 bg-gradient-to-b from-amber-950 to-amber-900 shadow-amber-800/40',
  Silver:  'border-slate-400 bg-gradient-to-b from-slate-700 to-slate-800 shadow-slate-400/40',
  Gold:    'border-yellow-400 bg-gradient-to-b from-yellow-900 to-yellow-950 shadow-yellow-400/50',
  Elite:   'border-violet-500 bg-gradient-to-b from-violet-950 to-indigo-950 shadow-violet-500/60',
  Icon:    'border-cyan-400 bg-gradient-to-b from-cyan-950 to-blue-950 shadow-cyan-400/60',
  Special: 'border-4 bg-gradient-to-b from-purple-950 to-pink-950 card-rainbow',
};

const RARITY_LABEL: Record<Rarity, string> = {
  Bronze:  'text-amber-600',
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
  player: Player;
  small?: boolean;
}

export function PlayerCard({ player, small = false }: Props) {
  const rarityStyle = RARITY_STYLES[player.rarity];
  const isSpecial = player.rarity === 'Special' || player.rarity === 'Icon';

  return (
    <div
      className={`
        relative rounded-xl border-2 ${rarityStyle}
        shadow-lg flex flex-col items-center
        ${small ? 'w-32 p-2 gap-1' : 'w-52 p-4 gap-2'}
        select-none overflow-hidden
      `}
    >
      {/* Shimmer overlay for Elite+ */}
      {isSpecial && (
        <div className="absolute inset-0 card-shimmer pointer-events-none rounded-xl" />
      )}

      {/* Rating badge */}
      <div className={`
        absolute top-2 left-2 font-black rounded-md
        ${small ? 'text-lg px-1' : 'text-3xl px-2 py-0.5'}
        ${RARITY_LABEL[player.rarity]}
      `}>
        {player.rating}
      </div>

      {/* Position badge */}
      <div className={`
        absolute top-2 right-2 rounded-md font-bold text-white
        ${small ? 'text-xs px-1 py-0' : 'text-xs px-1.5 py-0.5'}
        ${POS_COLOR[player.position]}
      `}>
        {player.position}
      </div>

      {/* Silhouette avatar */}
      <div className={`
        rounded-full flex items-center justify-center
        bg-black/30 border border-white/10 font-bold text-white/60
        ${small ? 'w-12 h-12 text-lg mt-4' : 'w-24 h-24 text-4xl mt-6'}
      `}>
        {player.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
      </div>

      {/* Name */}
      <div className={`
        font-bold text-white text-center leading-tight
        ${small ? 'text-xs' : 'text-sm'}
      `}>
        {player.name}
      </div>

      {/* Club + Flag */}
      <div className={`flex items-center gap-1 text-white/60 ${small ? 'text-xs' : 'text-xs'}`}>
        <span>{FLAG[player.nationality] ?? '🏳️'}</span>
        <span className="truncate max-w-24">{player.club}</span>
      </div>

      {/* Rarity label */}
      <div className={`font-semibold uppercase tracking-wider ${small ? 'text-xs' : 'text-xs'} ${RARITY_LABEL[player.rarity]}`}>
        {player.rarity}
      </div>

      {/* Traits (only on full card) */}
      {!small && player.traits.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center mt-1">
          {player.traits.slice(0, 3).map((t) => (
            <span key={t} className="bg-white/10 text-white/70 text-xs rounded px-1.5 py-0.5">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Gender indicator */}
      <div className="absolute bottom-2 right-2 text-white/30 text-xs">
        {player.gender === 'female' ? '♀' : '♂'}
      </div>
    </div>
  );
}
