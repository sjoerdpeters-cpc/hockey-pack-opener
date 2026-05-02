import { useRef, useState } from 'react';
import Papa from 'papaparse';
import type { Player, Position, Rarity, Gender, TeamType } from '../types';

interface Props {
  onImport: (players: Player[]) => void;
  onBack: () => void;
}

type RawRow = Record<string, string>;

function parsePlayer(row: RawRow, index: number): Player | null {
  const name = row['name']?.trim();
  const club = row['club']?.trim();
  const position = row['position']?.trim().toUpperCase() as Position;
  const rating = parseInt(row['rating'], 10);

  if (!name || !club || !['GK', 'DEF', 'MID', 'ATT'].includes(position) || isNaN(rating)) return null;

  const rawRarity = row['rarity']?.trim();
  const rarity: Rarity = (['Bronze', 'Silver', 'Gold', 'Elite', 'Icon', 'Special'].includes(rawRarity)
    ? rawRarity
    : rating >= 93 ? 'Icon' : rating >= 88 ? 'Elite' : rating >= 80 ? 'Gold' : rating >= 70 ? 'Silver' : 'Bronze'
  ) as Rarity;

  return {
    id: `csv-${index}-${Date.now()}`,
    name,
    gender: (row['gender'] === 'female' ? 'female' : 'male') as Gender,
    nationality: row['nationality']?.trim() || 'NL',
    club,
    teamType: (row['teamType'] || 'Hoofdklasse') as TeamType,
    position,
    rating,
    rarity,
    traits: row['traits'] ? row['traits'].split(';').map(t => t.trim()).filter(Boolean) : [],
    source: 'CSV',
  };
}

export function CsvImport({ onImport, onBack }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Player[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const errs: string[] = [];
        const parsed: Player[] = [];
        results.data.forEach((row, i) => {
          const p = parsePlayer(row, i);
          if (p) parsed.push(p);
          else errs.push(`Rij ${i + 2}: ongeldig (name/club/position/rating vereist)`);
        });
        setPreview(parsed);
        setErrors(errs);
      },
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-white/60 hover:text-white text-sm">← Terug</button>
        <h2 className="text-2xl font-bold text-white">CSV Import</h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
        <p className="text-white/60 text-sm mb-4">
          Upload een CSV met kolommen: <code className="text-blue-400">name, club, position, rating, gender, nationality, teamType, traits, rarity</code>
        </p>
        <p className="text-white/40 text-xs mb-4">Traits gescheiden door <code className="text-blue-400">;</code> (bijv. <code className="text-blue-400">Speed;Vision</code>)</p>
        <button
          onClick={() => inputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
        >
          Bestand kiezen
        </button>
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        {fileName && <span className="ml-3 text-white/50 text-sm">{fileName}</span>}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-4">
          <p className="text-red-400 font-bold mb-2">Validatiefouten ({errors.length})</p>
          <ul className="text-red-300 text-sm space-y-1 max-h-32 overflow-y-auto">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {preview.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-green-400 font-bold mb-3">{preview.length} spelers klaar voor import</p>
          <div className="max-h-48 overflow-y-auto space-y-1 mb-4">
            {preview.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-white/30 w-6">{i + 1}.</span>
                <span className="font-medium text-white">{p.name}</span>
                <span className="text-white/40">{p.club} · {p.position} · {p.rating}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onImport(preview)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
          >
            Importeer {preview.length} spelers
          </button>
        </div>
      )}
    </div>
  );
}
