import type { Club } from './types';

// Fan-made club colors for visual display. Not officially endorsed by any club.
export const clubs: Club[] = [
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    fullName: 'HC Amsterdam',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#CC0000',
    colorSecondary: '#000000',
  },
  {
    id: 'bloemendaal',
    name: 'Bloemendaal',
    fullName: 'HC Bloemendaal',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#003A96',
    colorSecondary: '#FFFFFF',
  },
  {
    id: 'den-bosch',
    name: 'Den Bosch',
    fullName: 'HC Den Bosch',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#006633',
    colorSecondary: '#FFFFFF',
  },
  {
    id: 'hdm',
    name: 'HDM',
    fullName: 'HC HDM',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#CC0000',
    colorSecondary: '#FFFFFF',
  },
  {
    id: 'hgc',
    name: 'HGC',
    fullName: 'HC HGC',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#FFD700',
    colorSecondary: '#00008B',
  },
  {
    id: 'hurley',
    name: 'Hurley',
    fullName: 'HC Hurley',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#1A1A1A',
    colorSecondary: '#FFFFFF',
  },
  {
    id: 'kampong',
    name: 'Kampong',
    fullName: 'HC Kampong',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#F58220',
    colorSecondary: '#1A1A1A',
  },
  {
    id: 'klein-zwitserland',
    name: 'Klein Zwitserland',
    fullName: 'HC Klein Zwitserland',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#CC0000',
    colorSecondary: '#FFFFFF',
  },
  {
    id: 'laren',
    name: 'Laren',
    fullName: 'HC Laren',
    country: 'NL',
    teams: ['female'],
    colorPrimary: '#0066CC',
    colorSecondary: '#FFFFFF',
  },
  {
    id: 'oranje-rood',
    name: 'Oranje-Rood',
    fullName: 'HC Oranje-Rood',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#FF6B00',
    colorSecondary: '#CC0000',
  },
  {
    id: 'pinoke',
    name: 'Pinoké',
    fullName: 'HC Pinoké',
    country: 'NL',
    teams: ['male'],
    colorPrimary: '#003087',
    colorSecondary: '#FFFFFF',
  },
  {
    id: 'rotterdam',
    name: 'Rotterdam',
    fullName: 'HC Rotterdam',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#003082',
    colorSecondary: '#FFFFFF',
  },
  {
    id: 'schaerweijde',
    name: 'Schaerweijde',
    fullName: 'HC Schaerweijde',
    country: 'NL',
    teams: ['male'],
    colorPrimary: '#8B0000',
    colorSecondary: '#000000',
  },
  {
    id: 'schc',
    name: 'SCHC',
    fullName: 'Sportclub HC',
    country: 'NL',
    teams: ['female'],
    colorPrimary: '#0066CC',
    colorSecondary: '#FFD700',
  },
  {
    id: 'tilburg',
    name: 'Tilburg',
    fullName: 'HC Tilburg',
    country: 'NL',
    teams: ['male', 'female'],
    colorPrimary: '#E30613',
    colorSecondary: '#FFFFFF',
  },
];

export const FALLBACK_CLUB: Club = {
  id: 'fallback',
  name: '',
  country: 'NL',
  colorPrimary: '#1E293B',
  colorSecondary: '#F8FAFC',
};

export function getClubByName(name: string): Club {
  return (
    clubs.find(c => c.name === name || c.fullName === name || c.id === name.toLowerCase().replace(/\s+/g, '-')) ??
    FALLBACK_CLUB
  );
}

export function darkenColor(hex: string, factor: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return '#0a0e1a';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

export function getClubInitials(club: Club): string {
  if (!club.name) return '?';
  return club.name
    .split(/[\s-]+/)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
