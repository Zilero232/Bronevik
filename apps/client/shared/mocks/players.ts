import type { MockPlayer } from './mocks.types';

import { mockSeries } from './series';

type PlayerSeed = Omit<MockPlayer, 'id' | 'trend'>;

const PLAYERS: PlayerSeed[] = [
  {
    nickname: 'Stalevar_1987',
    clanTag: 'KOPTE',
    battles: 48_211,
    winRate: 64.82,
    wn8: 3_412,
    avgDamage: 3_184,
    broneIndex: 9_640,
    marks3: 212,
    masters: 689,
    favoriteTank: 'Объект 140'
  },
  {
    nickname: 'Grom_i_Molniya',
    clanTag: 'RED',
    battles: 35_904,
    winRate: 61.37,
    wn8: 2_987,
    avgDamage: 2_941,
    broneIndex: 9_310,
    marks3: 164,
    masters: 541,
    favoriteTank: 'ИС-7'
  },
  {
    nickname: 'Tihiy_Ohotnik',
    clanTag: 'STEEL',
    battles: 27_640,
    winRate: 58.9,
    wn8: 2_455,
    avgDamage: 2_612,
    broneIndex: 8_870,
    marks3: 97,
    masters: 402,
    favoriteTank: 'Grille 15'
  },
  {
    nickname: 'Polkovnik_Vetrov',
    clanTag: 'VETER',
    battles: 61_022,
    winRate: 55.14,
    wn8: 1_978,
    avgDamage: 2_207,
    broneIndex: 7_920,
    marks3: 58,
    masters: 733,
    favoriteTank: 'Kranvagn'
  },
  {
    nickname: 'Babushka_na_T34',
    clanTag: null,
    battles: 14_380,
    winRate: 52.61,
    wn8: 1_386,
    avgDamage: 1_734,
    broneIndex: 6_650,
    marks3: 12,
    masters: 188,
    favoriteTank: 'Т-34-85'
  },
  {
    nickname: 'Kotik_v_Tigre',
    clanTag: 'MEOW',
    battles: 22_517,
    winRate: 50.08,
    wn8: 1_041,
    avgDamage: 1_498,
    broneIndex: 5_430,
    marks3: 6,
    masters: 241,
    favoriteTank: 'Tiger I'
  },
  {
    nickname: 'Arta_Po_Vyzovu',
    clanTag: 'BOOM',
    battles: 9_870,
    winRate: 47.9,
    wn8: 712,
    avgDamage: 1_120,
    broneIndex: 4_180,
    marks3: 2,
    masters: 77,
    favoriteTank: 'Объект 261'
  },
  {
    nickname: 'Novobranec_2026',
    clanTag: null,
    battles: 1_214,
    winRate: 45.22,
    wn8: 388,
    avgDamage: 614,
    broneIndex: 2_260,
    marks3: 0,
    masters: 9,
    favoriteTank: 'МС-1'
  }
];

export const MOCK_PLAYERS: MockPlayer[] = PLAYERS.map((player, index) => ({
  ...player,
  id: 12_400_000 + index * 7_919,
  trend: mockSeries({ seed: 101 + index, length: 30, base: player.wn8, amplitude: player.wn8 * 0.08, drift: 2 }).map((point) => point.value)
}));
