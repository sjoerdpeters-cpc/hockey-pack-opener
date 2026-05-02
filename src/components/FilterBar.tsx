import type { Position, Rarity, Gender } from '../types';

export interface Filters {
  search: string;
  gender: Gender | 'all';
  position: Position | 'all';
  rarity: Rarity | 'all';
  club: string;
  nationality: string;
}

interface Props {
  filters: Filters;
  clubs: string[];
  nationalities: string[];
  onChange: (f: Filters) => void;
}

const SELECT = 'bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400';

export function FilterBar({ filters, clubs, nationalities, onChange }: Props) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        type="text"
        placeholder="Zoek speler..."
        value={filters.search}
        onChange={e => set('search', e.target.value)}
        className="bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 w-40"
      />
      <select className={SELECT} value={filters.gender} onChange={e => set('gender', e.target.value as Filters['gender'])}>
        <option value="all">Heren & Dames</option>
        <option value="male">Heren</option>
        <option value="female">Dames</option>
      </select>
      <select className={SELECT} value={filters.position} onChange={e => set('position', e.target.value as Filters['position'])}>
        <option value="all">Alle posities</option>
        <option value="GK">GK</option>
        <option value="DEF">DEF</option>
        <option value="MID">MID</option>
        <option value="ATT">ATT</option>
      </select>
      <select className={SELECT} value={filters.rarity} onChange={e => set('rarity', e.target.value as Filters['rarity'])}>
        <option value="all">Alle zeldzaamheid</option>
        <option value="Bronze">Bronze</option>
        <option value="Silver">Silver</option>
        <option value="Gold">Gold</option>
        <option value="Elite">Elite</option>
        <option value="Icon">Icon</option>
        <option value="Special">Special</option>
      </select>
      <select className={SELECT} value={filters.club} onChange={e => set('club', e.target.value)}>
        <option value="">Alle clubs</option>
        {clubs.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className={SELECT} value={filters.nationality} onChange={e => set('nationality', e.target.value)}>
        <option value="">Alle landen</option>
        {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      {Object.values(filters).some(v => v !== 'all' && v !== '') && (
        <button
          onClick={() => onChange({ search: '', gender: 'all', position: 'all', rarity: 'all', club: '', nationality: '' })}
          className="text-white/40 hover:text-white text-sm underline"
        >
          Wis filters
        </button>
      )}
    </div>
  );
}
