import type { PackConfig } from '../types';
import { packs } from '../data/packs';

interface Props {
  coins: number;
  onSelect: (pack: PackConfig) => void;
}

export function PackSelector({ coins, onSelect }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Kies een Pack</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {packs.map((pack) => {
          const canAfford = coins >= pack.cost;
          return (
            <button
              key={pack.id}
              onClick={() => canAfford && onSelect(pack)}
              disabled={!canAfford}
              className={`
                relative rounded-xl p-4 flex flex-col items-center gap-2 border border-white/10
                bg-gradient-to-b ${pack.color}
                transition-all duration-200 group
                ${canAfford
                  ? 'hover:scale-105 hover:border-white/30 cursor-pointer'
                  : 'opacity-40 cursor-not-allowed'
                }
              `}
            >
              <span className="text-3xl">{pack.icon}</span>
              <span className="font-bold text-white text-sm text-center leading-tight">
                {pack.name}
              </span>
              <span className="text-white/60 text-xs text-center leading-tight">
                {pack.description}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-400 font-bold text-sm">
                  {pack.cost === 0 ? 'GRATIS' : `🪙 ${pack.cost}`}
                </span>
              </div>
              <div className="text-white/40 text-xs">{pack.cardCount} kaarten</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
