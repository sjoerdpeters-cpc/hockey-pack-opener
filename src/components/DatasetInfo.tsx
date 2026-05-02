import { datasetMeta } from '../data/dataset';
import { players } from '../data/dataset';

interface Props {
  onBack: () => void;
}

export function DatasetInfo({ onBack }: Props) {
  const uniqueClubs = [...new Set(players.map(p => p.club))].sort();
  const maleCount = players.filter(p => p.gender === 'male').length;
  const femaleCount = players.filter(p => p.gender === 'female').length;
  const intlCount = players.filter(p => p.isSeniorInternational).length;
  const jongOranjeCount = players.filter(p => p.isJongOranje).length;
  const foreignIntlCount = players.filter(p => p.isForeignSeniorInternational).length;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-white/60 hover:text-white text-sm">← Terug</button>
        <h2 className="text-2xl font-bold text-white">Dataset Info</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Versie</div>
          <div className="text-white font-mono text-lg font-bold">v{datasetMeta.version}</div>
          <div className="text-white/40 text-xs mt-1">{datasetMeta.lastUpdated}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Status</div>
          <div className="text-green-400 text-sm font-medium">{datasetMeta.status}</div>
          <div className="text-white/40 text-xs mt-1">Sequence #{datasetMeta.updateSequence}</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Scope</div>
        <div className="text-white/70 text-sm">{datasetMeta.scope}</div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Spelers ({players.length} totaal)</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-white font-bold text-xl">{maleCount}</div>
            <div className="text-white/40 text-xs">Heren</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-xl">{femaleCount}</div>
            <div className="text-white/40 text-xs">Dames</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-xl">{intlCount}</div>
            <div className="text-white/40 text-xs">🌟 Senior int'l</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-300 font-bold text-xl">{jongOranjeCount}</div>
            <div className="text-white/40 text-xs">🟡 Jong Oranje</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-bold text-xl">{foreignIntlCount}</div>
            <div className="text-white/40 text-xs">🌍 Buitenlands int'l</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-xl">{uniqueClubs.length}</div>
            <div className="text-white/40 text-xs">Clubs</div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Clubs</div>
        <div className="flex flex-wrap gap-2">
          {uniqueClubs.map(club => (
            <span key={club} className="bg-white/10 text-white/70 text-xs rounded px-2 py-1">{club}</span>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Notities</div>
        <p className="text-white/50 text-xs">{datasetMeta.notes}</p>
      </div>

      <p className="text-white/20 text-xs text-center mt-6">
        Disclaimer: Fan-made concept. Niet officieel verbonden aan KNHB, FIH, clubs of spelers.
        Ratings zijn fictief en bedoeld voor entertainment.
      </p>
    </div>
  );
}
