import { readFileSync } from 'node:fs';

import type { VehicleResultFixtureInput } from './fixtures.types';

export const readFixture = (name: string) => new Uint8Array(readFileSync(new URL(`./fixtures/${name}`, import.meta.url)));

export const FIXTURE = {
  wgFull: 'wg-1.26.0.2-full.wotreplay',
  wgIncomplete: 'wg-1.14.1.3-incomplete.wotreplay'
} as const;

export const LESTA_ARENA = {
  clientVersionFromXml: 'Мир танков v.1.30.0.0 #1234',
  clientVersionFromExe: '1.30.0.0',
  regionCode: 'RU',
  serverName: 'RU5',
  mapName: '05_prohorovka',
  mapDisplayName: 'Прохоровка',
  gameplayID: 'ctf',
  battleType: 1,
  dateTime: '24.09.2026 18:05:07',
  playerID: 1001,
  playerName: 'Recorder',
  playerVehicle: 'ussr-R04_T-34',
  vehicles: {
    '500': { name: 'Recorder', vehicleType: 'ussr:R04_T-34', team: 1, clanAbbrev: 'BRNV', maxHealth: 800 },
    '501': { name: 'Ally', vehicleType: 'germany:G04_PzVI_Tiger_I', team: 1, clanAbbrev: '', maxHealth: 1400 },
    '502': { name: 'Enemy', vehicleType: 'usa:A06_M4A3E8_Sherman', team: 2, clanAbbrev: 'FOE', maxHealth: 900 }
  }
} as const;

const vehicleResult = (input: VehicleResultFixtureInput) => ({
  ...input,
  damageAssistedRadio: 120,
  damageAssistedTrack: 30,
  damageAssistedStun: 0,
  damageBlockedByArmor: 400,
  damageReceived: 250,
  spotted: 2,
  kills: 1,
  tkills: 0,
  xp: 700,
  credits: 20000,
  shots: 8,
  directEnemyHits: 6,
  piercings: 5,
  health: input.team === 1 ? 550 : 0,
  deathReason: input.team === 1 ? -1 : 0,
  killerID: input.team === 1 ? 0 : 500,
  lifeTime: 300,
  maxHealth: 800
});

export const LESTA_BATTLE = {
  arenaUniqueID: '__ARENA__',
  common: { winnerTeam: 1, duration: 412, finishReason: 1, arenaCreateTime: 1790000000, arenaTypeID: 5, bonusType: 1 },
  personal: {
    '1': { accountDBID: 1001, typeCompDescr: 1, team: 1, xp: 1400, credits: 45000, damageDealt: 1500 },
    avatar: { accountDBID: 1001 }
  },
  players: {
    '1001': { name: 'Recorder', clanAbbrev: 'BRNV', team: 1 },
    '1002': { name: 'Ally', clanAbbrev: '', team: 1 },
    '1003': { name: 'Enemy', clanAbbrev: 'FOE', team: 2 }
  },
  vehicles: {
    '500': [vehicleResult({ accountDBID: 1001, typeCompDescr: 1, team: 1, damageDealt: 1500 })],
    '501': [vehicleResult({ accountDBID: 1002, typeCompDescr: 7249, team: 1, damageDealt: 900 })],
    '502': [vehicleResult({ accountDBID: 1003, typeCompDescr: 13089, team: 2, damageDealt: 300 })]
  }
};

const LESTA_RESULTS = [LESTA_BATTLE, {}, { '500': { frags: 1 } }];

export const ARENA_UNIQUE_ID = '123456789012345678';

export const lestaResultsJson = () => JSON.stringify(LESTA_RESULTS).replace('"__ARENA__"', ARENA_UNIQUE_ID);
