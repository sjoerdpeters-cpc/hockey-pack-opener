import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player, PackConfig } from '../types';
import { PlayerCard } from './PlayerCard';

interface Props {
  pack: PackConfig;
  cards: Player[];
  onDone: () => void;
}

export function PackOpening({ pack, cards, onDone }: Props) {
  const [phase, setPhase] = useState<'pack' | 'reveal' | 'all'>('pack');
  const [revealed, setRevealed] = useState<number>(0);

  const hasSpecial = cards.some(c => c.rarity === 'Icon' || c.rarity === 'Elite' || c.rarity === 'Special');

  function openPack() {
    setPhase('reveal');
  }

  function revealNext() {
    if (revealed < cards.length - 1) {
      setRevealed(r => r + 1);
    } else {
      setPhase('all');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <AnimatePresence mode="wait">
        {phase === 'pack' && (
          <motion.div
            key="pack"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="flex flex-col items-center gap-8"
          >
            <h2 className="text-3xl font-bold text-white">{pack.name}</h2>
            <motion.button
              onClick={openPack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative w-48 h-64 rounded-2xl border-2 border-white/30
                bg-gradient-to-b ${pack.color}
                flex flex-col items-center justify-center gap-4
                cursor-pointer shadow-2xl
                ${hasSpecial ? 'card-rainbow' : ''}
              `}
            >
              <span className="text-6xl">{pack.icon}</span>
              <span className="text-white font-bold text-lg">{pack.name}</span>
              <span className="text-white/60 text-sm">{pack.cardCount} kaarten</span>
              <div className="absolute inset-0 card-shimmer rounded-2xl" />
            </motion.button>
            <p className="text-white/60 text-sm animate-pulse">Klik om te openen</p>
          </motion.div>
        )}

        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="text-white/50 text-sm">
              Kaart {revealed + 1} / {cards.length}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={revealed}
                initial={{ rotateY: 90, scale: 0.8 }}
                animate={{ rotateY: 0, scale: 1 }}
                exit={{ rotateY: -90, scale: 0.8 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ perspective: 1000 }}
              >
                {(cards[revealed].rarity === 'Elite' || cards[revealed].rarity === 'Icon' || cards[revealed].rarity === 'Special') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-white rounded-xl pointer-events-none z-10"
                  />
                )}
                <PlayerCard player={cards[revealed]} />
              </motion.div>
            </AnimatePresence>

            <motion.button
              onClick={revealNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl border border-white/20 transition-colors"
            >
              {revealed < cards.length - 1 ? 'Volgende kaart →' : 'Alle kaarten bekijken'}
            </motion.button>
          </motion.div>
        )}

        {phase === 'all' && (
          <motion.div
            key="all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8 w-full max-w-4xl"
          >
            <h2 className="text-2xl font-bold text-white">Je pack!</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PlayerCard player={card} />
                </motion.div>
              ))}
            </div>
            <button
              onClick={onDone}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Terug naar home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
