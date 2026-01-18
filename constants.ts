import { Player } from './types';

export const COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-rose-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-lime-500',
  'bg-fuchsia-500',
  'bg-sky-500',
  'bg-orange-500',
];

// Core 12 Role definitions
export const ROLE_DEFINITIONS = [
  { shortName: 'ST', fullName: 'Striker', number: 9, color: 'bg-red-600' },
  { shortName: 'LW', fullName: 'Left Wing', number: 7, color: 'bg-blue-600' },
  { shortName: 'RW', fullName: 'Right Wing', number: 11, color: 'bg-blue-500' },
  { shortName: 'CAM', fullName: 'Attacking Mid', number: 10, color: 'bg-purple-600' },
  { shortName: 'CM', fullName: 'Center Mid', number: 8, color: 'bg-green-600' },
  { shortName: 'CDM', fullName: 'Defensive Mid', number: 6, color: 'bg-teal-600' },
  { shortName: 'LB', fullName: 'Left Back', number: 3, color: 'bg-cyan-600' },
  { shortName: 'LCB', fullName: 'Left Center Back', number: 4, color: 'bg-indigo-600' },
  { shortName: 'RCB', fullName: 'Right Center Back', number: 5, color: 'bg-indigo-500' },
  { shortName: 'RB', fullName: 'Right Back', number: 2, color: 'bg-cyan-500' },
  { shortName: 'GK', fullName: 'Goalkeeper', number: 1, color: 'bg-yellow-500' },
  { shortName: 'MGR', fullName: 'Manager', number: 0, color: 'bg-gray-800' },
];

// Extra roles for players beyond 12 (Bench & Staff)
export const EXTRA_ROLE_DEFINITIONS = [
  { shortName: 'SUB1', fullName: 'Substitute #1', number: 12, color: 'bg-slate-600' },
  { shortName: 'SUB2', fullName: 'Substitute #2', number: 13, color: 'bg-slate-500' },
  { shortName: 'SUB3', fullName: 'Substitute #3', number: 14, color: 'bg-slate-400' },
  { shortName: 'RES', fullName: 'Reserve Player', number: 15, color: 'bg-zinc-600' },
  { shortName: 'MED', fullName: 'Team Medic', number: 16, color: 'bg-emerald-600' },
  { shortName: 'KIT', fullName: 'Kit Manager', number: 17, color: 'bg-amber-600' },
  { shortName: 'VAR', fullName: 'VAR Referee', number: 18, color: 'bg-rose-600' },
  { shortName: 'H2O', fullName: 'Water Boy', number: 19, color: 'bg-sky-600' },
  { shortName: 'ASST', fullName: 'Assistant Coach', number: 20, color: 'bg-violet-600' },
  { shortName: 'SCT', fullName: 'Scout', number: 21, color: 'bg-lime-600' },
  { shortName: 'PHYS', fullName: 'Physio', number: 22, color: 'bg-pink-600' },
  { shortName: 'ANL', fullName: 'Data Analyst', number: 23, color: 'bg-fuchsia-600' },
  { shortName: 'GKC', fullName: 'GK Coach', number: 24, color: 'bg-yellow-600' },
  { shortName: 'FAN', fullName: 'Super Fan', number: 25, color: 'bg-red-500' },
];

// Generate roles based on player count
export const generateRolesForPlayerCount = (playerCount: number) => {
  const allRoles = [...ROLE_DEFINITIONS];

  if (playerCount > ROLE_DEFINITIONS.length) {
    const extraNeeded = playerCount - ROLE_DEFINITIONS.length;
    const extraRoles = EXTRA_ROLE_DEFINITIONS.slice(0, extraNeeded);

    // If we need more than available extras, generate numbered subs
    if (extraNeeded > EXTRA_ROLE_DEFINITIONS.length) {
      for (let i = EXTRA_ROLE_DEFINITIONS.length; i < extraNeeded; i++) {
        allRoles.push({
          shortName: `EX${i + 1}`,
          fullName: `Extra Role #${i + 1}`,
          number: 25 + i,
          color: COLORS[(12 + i) % COLORS.length],
        });
      }
      allRoles.push(...EXTRA_ROLE_DEFINITIONS);
    } else {
      allRoles.push(...extraRoles);
    }
  }

  return allRoles;
};

// Global football stars (default player names)
export const DEFAULT_NAMES = [
  'Messi',
  'Ronaldo',
  'Mbappe',
  'Haaland',
  'Bellingham',
  'Vini Jr',
  'De Bruyne',
  'Salah',
  'Kane',
  'Neymar',
  'Son',
  'Lewandowski',
];

// Create initial players
export const INITIAL_PLAYERS: Player[] = DEFAULT_NAMES.map((name, idx) => ({
  id: String(idx + 1),
  name: name,
  role: '',
  number: 0,
  color: COLORS[idx % COLORS.length],
}));

// Timer settings
export const SHOT_CLOCK_SECONDS = 10;

// App branding
export const APP_NAME = 'SQUAD SNIPER';
