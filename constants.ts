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

// Core 12 Role definitions - ordered by squad number (1-12) to match player index
export const ROLE_DEFINITIONS = [
  { shortName: 'GK', fullName: 'Goalkeeper', number: 1, color: 'bg-yellow-500' },    // 1 - Buffon
  { shortName: 'RB', fullName: 'Right Back', number: 2, color: 'bg-cyan-500' },      // 2 - Cafu
  { shortName: 'RCB', fullName: 'Right Center Back', number: 3, color: 'bg-indigo-500' }, // 3 - Maldini (changed)
  { shortName: 'LCB', fullName: 'Left Center Back', number: 4, color: 'bg-indigo-600' }, // 4 - Ramos
  { shortName: 'LB', fullName: 'Left Back', number: 5, color: 'bg-cyan-600' },       // 5 - Carlos (changed)
  { shortName: 'CDM', fullName: 'Defensive Mid', number: 6, color: 'bg-teal-600' },  // 6 - Xavi
  { shortName: 'LW', fullName: 'Left Wing', number: 7, color: 'bg-blue-600' },       // 7 - Ronaldo
  { shortName: 'CM', fullName: 'Center Mid', number: 8, color: 'bg-green-600' },     // 8 - Iniesta
  { shortName: 'ST', fullName: 'Striker', number: 9, color: 'bg-red-600' },          // 9 - Maradona
  { shortName: 'RW', fullName: 'Right Wing', number: 10, color: 'bg-blue-500' },     // 10 - Messi (changed)
  { shortName: 'CAM', fullName: 'Attacking Mid', number: 11, color: 'bg-purple-600' }, // 11 - Zidane (changed)
  { shortName: 'MGR', fullName: 'Manager', number: 12, color: 'bg-gray-800' },       // 12 - Guardiola
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

// Generate roles based on player count and custom roles
export const generateRolesForPlayerCount = (playerCount: number, players?: { customRole?: string }[]) => {
  const allRoles = [...ROLE_DEFINITIONS];

  if (playerCount > ROLE_DEFINITIONS.length) {
    const extraNeeded = playerCount - ROLE_DEFINITIONS.length;

    // Use custom roles from players if provided
    if (players) {
      for (let i = 0; i < extraNeeded; i++) {
        const playerIdx = ROLE_DEFINITIONS.length + i;
        const customRole = players[playerIdx]?.customRole;

        if (customRole) {
          const roleDefinition = EXTRA_ROLE_DEFINITIONS.find(r => r.shortName === customRole);
          if (roleDefinition) {
            allRoles.push(roleDefinition);
            continue;
          }
        }

        // Fallback to sequential extra roles
        if (i < EXTRA_ROLE_DEFINITIONS.length) {
          allRoles.push(EXTRA_ROLE_DEFINITIONS[i]);
        } else {
          allRoles.push({
            shortName: `EX${i + 1}`,
            fullName: `Extra Role #${i + 1}`,
            number: 25 + i,
            color: COLORS[(12 + i) % COLORS.length],
          });
        }
      }
    } else {
      // Original logic when no players provided
      const extraRoles = EXTRA_ROLE_DEFINITIONS.slice(0, extraNeeded);
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
  }

  return allRoles;
};

// Legendary football stars (default player names, ordered by squad number 1-12)
export const DEFAULT_NAMES = [
  'Buffon',      // 1 - GK
  'Cafu',        // 2 - RB
  'Maldini',     // 3 - LB
  'Ramos',       // 4 - LCB
  'Carlos',      // 5 - RCB
  'Xavi',        // 6 - CDM
  'Ronaldo',     // 7 - LW
  'Iniesta',     // 8 - CM
  'Maradona',    // 9 - ST
  'Messi',       // 10 - CAM
  'Zidane',      // 11 - RW
  'Guardiola',   // 12 - MGR
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

// Position missions (민준 피셜)
export const ROLE_MISSIONS: Record<string, { ko: string; en: string }> = {
  // Core positions
  'ST': { ko: '솔로런 성공하기 ⚽', en: 'Score a solo goal ⚽' },
  'LW': { ko: '사이드에서 사포 성공하기 🌀', en: 'Complete a skill move 🌀' },
  'RW': { ko: '컷인 후 슛 성공하기 🎯', en: 'Score after a cut-in 🎯' },
  'CAM': { ko: '결정적인 스루패스 성공하기 🎁', en: 'Make a key through pass 🎁' },
  'CM': { ko: '경기당 패스 성공률 80% 이상 📊', en: 'Achieve 80%+ pass accuracy 📊' },
  'CDM': { ko: '상대 공격 차단하기 🛡️', en: 'Block an opponent attack 🛡️' },
  'LB': { ko: '오버래핑 후 크로스 올리기 ➡️', en: 'Overlap and cross ➡️' },
  'LCB': { ko: '공중볼 경합 승리하기 ✈️', en: 'Win an aerial duel ✈️' },
  'RCB': { ko: '클린시트 달성하기 🧤', en: 'Keep a clean sheet 🧤' },
  'RB': { ko: '태클 성공하기 🦵', en: 'Make a successful tackle 🦵' },
  'GK': { ko: '1대1 세이브 성공하기 🥅', en: 'Make a 1v1 save 🥅' },
  'MGR': { ko: '전술 변경으로 역전 이끌기 📋', en: 'Lead a tactical comeback 📋' },
  // Extra positions
  'SUB1': { ko: '교체 투입 후 득점 기여하기 🔥', en: 'Impact the game as sub 🔥' },
  'SUB2': { ko: '경기 흐름 바꾸기 💫', en: 'Change the game flow 💫' },
  'SUB3': { ko: '막판 체력 보여주기 🏃', en: 'Show late-game stamina 🏃' },
  'RES': { ko: '열심히 응원하기 📣', en: 'Cheer for the team 📣' },
  'MED': { ko: '부상자 없이 경기 마치기 🏥', en: 'Keep everyone healthy 🏥' },
  'KIT': { ko: '유니폼 완벽하게 준비하기 👕', en: 'Prepare perfect kits 👕' },
  'VAR': { ko: '공정한 판정 내리기 📺', en: 'Make fair decisions 📺' },
  'H2O': { ko: '선수들 수분 보충시키기 💧', en: 'Keep players hydrated 💧' },
  'ASST': { ko: '감독 보조하기 📝', en: 'Assist the manager 📝' },
  'SCT': { ko: '상대팀 약점 분석하기 🔍', en: 'Analyze opponent weakness 🔍' },
  'PHYS': { ko: '선수 컨디션 관리하기 💆', en: 'Manage player fitness 💆' },
  'ANL': { ko: '통계 분석 제공하기 📈', en: 'Provide data analysis 📈' },
  'GKC': { ko: '골키퍼 훈련시키기 🥊', en: 'Train the goalkeeper 🥊' },
  'FAN': { ko: '응원가 부르기 🎵', en: 'Lead the chants 🎵' },
};

// i18n translations
export type Language = 'ko' | 'en';

export const TRANSLATIONS = {
  ko: {
    appName: 'SQUAD SNIPER',
    startDraft: '🎯 START DRAFT',
    addPlayer: '+ 선수 추가',
    howToPlay: '게임 방법',
    tutorial: {
      title: 'HOW TO PLAY',
      step1: '방향키 또는 WASD로 조준점 이동',
      step2: '유니폼에 조준하여 타겟 잠금',
      step3: '10초 안에 SHOOT 버튼 클릭',
      step4: '빈 공간은 사격 불가',
      step5: 'Shift로 정밀 조준 모드',
      tip: '배정된 포지션의 미션을 완수하세요!',
      start: '시작하기'
    },
    drafting: 'DRAFTING',
    left: '명 남음',
    roles: '역할',
    shotClock: 'SHOT CLOCK',
    shoot: '🎯 SHOOT',
    firing: 'FIRING...',
    locked: '🎯 LOCKED',
    scanning: '⭕ SCANNING',
    precision: '🔬 PRECISION',
    randomAssignment: 'RANDOM ASSIGNMENT!',
    roleAssigned: '⚽ ROLE ASSIGNED ⚽',
    mission: 'MISSION',
    assignedTo: 'Assigned to',
    nextPlayer: '➡️ Next Player',
    finishDraft: '🏆 Finish Draft',
    squadComplete: 'SQUAD COMPLETE!',
    rolesAssigned: '역할 배정됨',
    backToSetup: '🏠 Back to Setup',
    exit: 'Exit',
  },
  en: {
    appName: 'SQUAD SNIPER',
    startDraft: '🎯 START DRAFT',
    addPlayer: '+ Add Player',
    howToPlay: 'How to Play',
    tutorial: {
      title: '🎯 How to Play',
      step1: 'Move crosshair with Arrow Keys or WASD',
      step2: 'Aim at a jersey to lock on',
      step3: 'Press SHOOT within 10 seconds',
      step4: 'Empty space cannot be shot',
      step5: 'Hold Shift for precision mode',
      tip: 'Complete the mission assigned to your position!',
      start: "Got it! Let's go"
    },
    drafting: 'DRAFTING',
    left: 'left',
    roles: 'roles',
    shotClock: 'SHOT CLOCK',
    shoot: '🎯 SHOOT',
    firing: 'FIRING...',
    locked: '🎯 LOCKED',
    scanning: '⭕ SCANNING',
    precision: '🔬 PRECISION',
    randomAssignment: 'RANDOM ASSIGNMENT!',
    roleAssigned: '⚽ ROLE ASSIGNED ⚽',
    mission: 'MISSION',
    assignedTo: 'Assigned to',
    nextPlayer: '➡️ Next Player',
    finishDraft: '🏆 Finish Draft',
    squadComplete: 'SQUAD COMPLETE!',
    rolesAssigned: 'roles assigned',
    backToSetup: '🏠 Back to Setup',
    exit: 'Exit',
  }
};

export const getTranslation = (lang: Language) => TRANSLATIONS[lang];

