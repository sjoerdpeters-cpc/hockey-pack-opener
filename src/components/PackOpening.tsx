import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EnrichedPlayer, PackConfig } from '../types';
import { PlayerCard } from './PlayerCard';
import { getClubByName } from '../clubs';

interface Props {
  pack: PackConfig;
  cards: EnrichedPlayer[];
  onDone: () => void;
}

const SPECIAL_RARITIES = new Set(['Elite', 'Icon', 'Special']);

function playRevealSound(rarity: string) {
  try {
    const ctx = new AudioContext();

    type RarityKey = 'Icon' | 'Special' | 'Elite';
    const CONFIGS: Record<RarityKey, { notes: number[]; vol: number; step: number }> = {
      Icon:    { notes: [261.63, 523.25, 659.25, 783.99, 1046.50, 1318.51], vol: 0.28, step: 0.09 },
      Special: { notes: [349.23, 466.16, 587.33, 739.99, 987.77, 1318.51], vol: 0.26, step: 0.08 },
      Elite:   { notes: [392, 493.88, 587.33, 783.99, 987.77],             vol: 0.24, step: 0.10 },
    };
    const cfg = CONFIGS[rarity as RarityKey] ?? CONFIGS.Elite;

    cfg.notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime + i * cfg.step;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(cfg.vol, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      osc.start(t);
      osc.stop(t + 0.65);
    });

    // Sparkle noise burst
    const bufSize = Math.floor(ctx.sampleRate * 0.35);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.07));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 4500;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    noise.connect(hpf);
    hpf.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();

    setTimeout(() => { ctx.close().catch(() => {}); }, 2500);
  } catch {
    // AudioContext unavailable (e.g. blocked by browser)
  }
}

export function PackOpening({ pack, cards, onDone }: Props) {
  const [phase, setPhase] = useState<'pack' | 'reveal' | 'all'>('pack');
  const [revealed, setRevealed] = useState<number>(0);
  const [flaring, setFlaring] = useState(false);
  const [flareColor, setFlareColor] = useState('#fbbf24');

  const hasSpecial = cards.some(c => SPECIAL_RARITIES.has(c.rarity));

  useEffect(() => {
    if (phase !== 'reveal') return;
    const card = cards[revealed];
    if (!SPECIAL_RARITIES.has(card.rarity)) {
      setFlaring(false);
      return;
    }
    const color = getClubByName(card.club).colorPrimary;
    setFlareColor(color);
    setFlaring(true);
    playRevealSound(card.rarity);
    const t = setTimeout(() => setFlaring(false), 1500);
    return () => clearTimeout(t);
  }, [revealed, phase, cards]);

  function openPack() { setPhase('reveal'); }

  function revealNext() {
    if (revealed < cards.length - 1) {
      setRevealed(r => r + 1);
    } else {
      setPhase('all');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">

      {/* Club-color flare overlay */}
      <AnimatePresence>
        {flaring && (
          <motion.div
            key="flare"
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          >
            {/* Solid color wash that fades */}
            <motion.div
              className="absolute inset-0"
              style={{ background: flareColor }}
              initial={{ opacity: 0.75 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            {/* Radial burst expanding from center */}
            <motion.div
              className="absolute"
              style={{
                inset: '-50%',
                background: `radial-gradient(circle at 50% 50%, #ffffff 0%, ${flareColor} 20%, ${flareColor}88 45%, transparent 65%)`,
              }}
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            {/* Rotating light rays */}
            <motion.div
              className="absolute"
              style={{
                inset: '-100%',
                background: `repeating-conic-gradient(${flareColor}55 0deg, transparent 6deg, transparent 13deg)`,
              }}
              initial={{ rotate: 0, opacity: 0.55 }}
              animate={{ rotate: 60, opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
