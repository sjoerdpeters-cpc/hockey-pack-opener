import { useState, useEffect } from 'react';
import type { PackConfig, CollectedCard, EnrichedPlayer } from './types';
import { PackSelector } from './components/PackSelector';
import { PackOpening } from './components/PackOpening';
import { Collection } from './components/Collection';
import { DatasetInfo } from './components/DatasetInfo';
import { openPack, loadCollection, saveToCollection, loadCoins, saveCoins, sellCards } from './lib/packLogic';
import { datasetMeta } from './data/dataset';

type Screen = 'home' | 'opening' | 'collection' | 'dataset';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedPack, setSelectedPack] = useState<PackConfig | null>(null);
  const [drawnCards, setDrawnCards] = useState<EnrichedPlayer[]>([]);
  const [collection, setCollection] = useState<CollectedCard[]>([]);
  const [coins, setCoins] = useState(1500);

  useEffect(() => {
    setCollection(loadCollection());
    setCoins(loadCoins());
  }, []);

  function handleSelectPack(pack: PackConfig) {
    if (coins < pack.cost) return;
    const newCoins = coins - pack.cost;
    setCoins(newCoins);
    saveCoins(newCoins);

    const cards = openPack(pack);
    setDrawnCards(cards);
    setSelectedPack(pack);

    const updated = saveToCollection(cards, collection);
    setCollection(updated);

    setScreen('opening');
  }

  function handleSell(cards: CollectedCard[]) {
    const { remaining, coinsEarned } = sellCards(cards, collection);
    setCollection(remaining);
    const newCoins = coins + coinsEarned;
    setCoins(newCoins);
    saveCoins(newCoins);
  }

  const uniqueCount = new Set(collection.map(c => c.id)).size;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-2 font-black text-lg text-white hover:text-blue-400 transition-colors"
          >
            🏑 <span>Hockey Pack Opener</span>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => setScreen('collection')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                screen === 'collection' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              📦 Collectie <span className="bg-white/20 rounded-full px-1.5 text-xs">{uniqueCount}</span>
            </button>
            <button
              onClick={() => setScreen('dataset')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                screen === 'dataset' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={`Dataset v${datasetMeta.version}`}
            >
              🗄️ <span className="hidden sm:inline">v{datasetMeta.version}</span>
            </button>
            <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-1.5">
              <span>🪙</span>
              <span className="font-bold text-yellow-400">{coins.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Screens */}
      {screen === 'home' && (
        <main className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center gap-12">
          <div className="text-center">
            <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
              Hockey Pack Opener
            </h1>
            <p className="text-white/50 text-lg">
              Tulp Hoofdklasse Heren &amp; Dames 2025-2026
            </p>
          </div>

          {collection.length > 0 && (
            <div className="flex gap-4 text-center flex-wrap justify-center">
              <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3">
                <div className="text-2xl font-bold text-white">{uniqueCount}</div>
                <div className="text-white/50 text-xs">Unieke spelers</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3">
                <div className="text-2xl font-bold text-white">{collection.length}</div>
                <div className="text-white/50 text-xs">Totaal kaarten</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3">
                <div className="text-2xl font-bold text-yellow-400">
                  {collection.filter(c => c.rarity === 'Elite' || c.rarity === 'Icon').length}
                </div>
                <div className="text-white/50 text-xs">Elite & Icon</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3">
                <div className="text-2xl font-bold text-yellow-300">
                  {[...new Set(collection.map(c => c.id))].filter(
                    id => collection.find(c => c.id === id)?.isSeniorInternational
                  ).length}
                </div>
                <div className="text-white/50 text-xs">🌟 Internationals</div>
              </div>
            </div>
          )}

          <PackSelector coins={coins} onSelect={handleSelectPack} />

          <p className="text-white/20 text-xs text-center max-w-xl">
            Fan-made concept · Niet officieel verbonden aan KNHB, FIH, clubs of spelers ·
            Ratings zijn fictief en bedoeld voor entertainment
          </p>
        </main>
      )}

      {screen === 'opening' && selectedPack && (
        <PackOpening
          pack={selectedPack}
          cards={drawnCards}
          onDone={() => setScreen('home')}
        />
      )}

      {screen === 'collection' && (
        <Collection collection={collection} onBack={() => setScreen('home')} onSell={handleSell} />
      )}

      {screen === 'dataset' && (
        <DatasetInfo onBack={() => setScreen('home')} />
      )}
    </div>
  );
}
