import type { MockTank } from './mocks.types';

import { mockSeries } from './series';
import { mockVehicleImages } from './vehicle-images';

type TankSeed = Omit<MockTank, 'id' | 'images' | 'trend'>;

const TANKS: TankSeed[] = [
  {
    slug: 'object-140',
    name: 'Объект 140',
    nation: 'ussr',
    type: 'mediumTank',
    tier: 10,
    winRate: 51.84,
    avgDamage: 2_986,
    moe3: 4_312,
    battles: 1_824_310,
    isPremium: false
  },
  {
    slug: 'is-7',
    name: 'ИС-7',
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    winRate: 50.92,
    avgDamage: 3_104,
    moe3: 4_518,
    battles: 2_140_882,
    isPremium: false
  },
  {
    slug: 'grille-15',
    name: 'Grille 15',
    nation: 'germany',
    type: 'AT-SPG',
    tier: 10,
    winRate: 50.21,
    avgDamage: 3_322,
    moe3: 4_977,
    battles: 1_402_975,
    isPremium: false
  },
  {
    slug: 'kranvagn',
    name: 'Kranvagn',
    nation: 'sweden',
    type: 'heavyTank',
    tier: 10,
    winRate: 51.07,
    avgDamage: 3_058,
    moe3: 4_489,
    battles: 986_442,
    isPremium: false
  },
  {
    slug: '60tp',
    name: '60TP Lewandowskiego',
    nation: 'poland',
    type: 'heavyTank',
    tier: 10,
    winRate: 50.48,
    avgDamage: 3_215,
    moe3: 4_702,
    battles: 1_117_503,
    isPremium: false
  },
  {
    slug: 'progetto-65',
    name: 'Progetto M40 mod. 65',
    nation: 'italy',
    type: 'mediumTank',
    tier: 10,
    winRate: 51.33,
    avgDamage: 2_874,
    moe3: 4_205,
    battles: 874_120,
    isPremium: false
  },
  {
    slug: 't-100-lt',
    name: 'Т-100 ЛТ',
    nation: 'ussr',
    type: 'lightTank',
    tier: 10,
    winRate: 50.66,
    avgDamage: 2_210,
    moe3: 3_998,
    battles: 1_004_617,
    isPremium: false
  },
  {
    slug: 'object-261',
    name: 'Объект 261',
    nation: 'ussr',
    type: 'SPG',
    tier: 10,
    winRate: 49.72,
    avgDamage: 2_140,
    moe3: 3_486,
    battles: 612_380,
    isPremium: false
  },
  {
    slug: 'type-71',
    name: 'Type 71',
    nation: 'japan',
    type: 'heavyTank',
    tier: 10,
    winRate: 50.11,
    avgDamage: 3_267,
    moe3: 4_655,
    battles: 540_229,
    isPremium: false
  },
  {
    slug: 'tvp-t-50-51',
    name: 'TVP T 50/51',
    nation: 'czech',
    type: 'mediumTank',
    tier: 10,
    winRate: 50.87,
    avgDamage: 2_931,
    moe3: 4_390,
    battles: 1_266_054,
    isPremium: false
  },
  {
    slug: 'wz-121',
    name: 'WZ-121',
    nation: 'china',
    type: 'mediumTank',
    tier: 10,
    winRate: 50.39,
    avgDamage: 2_802,
    moe3: 4_120,
    battles: 755_812,
    isPremium: false
  },
  {
    slug: 'foch-b',
    name: 'AMX 50 Foch B',
    nation: 'france',
    type: 'AT-SPG',
    tier: 10,
    winRate: 49.86,
    avgDamage: 3_176,
    moe3: 4_644,
    battles: 698_331,
    isPremium: false
  },
  {
    slug: 'fv4005',
    name: 'FV4005 Stage II',
    nation: 'uk',
    type: 'AT-SPG',
    tier: 10,
    winRate: 49.54,
    avgDamage: 3_089,
    moe3: 4_571,
    battles: 612_774,
    isPremium: false
  },
  {
    slug: 't110e5',
    name: 'T110E5',
    nation: 'usa',
    type: 'heavyTank',
    tier: 10,
    winRate: 50.73,
    avgDamage: 2_998,
    moe3: 4_402,
    battles: 1_089_265,
    isPremium: false
  },
  {
    slug: 'object-279r',
    name: 'Объект 279 ранний',
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    winRate: 53.95,
    avgDamage: 3_402,
    moe3: 4_880,
    battles: 412_906,
    isPremium: false
  },
  {
    slug: 'lt-432',
    name: 'ЛТ-432',
    nation: 'ussr',
    type: 'lightTank',
    tier: 8,
    winRate: 51.2,
    avgDamage: 1_532,
    moe3: 2_780,
    battles: 1_530_417,
    isPremium: true
  },
  {
    slug: 'skoda-t-27',
    name: 'Škoda T 27',
    nation: 'czech',
    type: 'mediumTank',
    tier: 8,
    winRate: 52.04,
    avgDamage: 1_904,
    moe3: 3_050,
    battles: 802_635,
    isPremium: true
  },
  {
    slug: 'k-91',
    name: 'К-91',
    nation: 'ussr',
    type: 'mediumTank',
    tier: 10,
    winRate: 50.18,
    avgDamage: 2_845,
    moe3: 4_152,
    battles: 690_471,
    isPremium: false
  },
  {
    slug: 'bz-75',
    name: 'BZ-75',
    nation: 'china',
    type: 'heavyTank',
    tier: 10,
    winRate: 51.56,
    avgDamage: 3_294,
    moe3: 4_733,
    battles: 488_216,
    isPremium: false
  },
  {
    slug: 'strv-103b',
    name: 'Strv 103B',
    nation: 'sweden',
    type: 'AT-SPG',
    tier: 10,
    winRate: 50.61,
    avgDamage: 3_150,
    moe3: 4_590,
    battles: 734_902,
    isPremium: false
  },
  {
    slug: 'ms-1',
    name: 'МС-1',
    nation: 'ussr',
    type: 'lightTank',
    tier: 1,
    winRate: 48.3,
    avgDamage: 118,
    moe3: 320,
    battles: 3_402_118,
    isPremium: false
  },
  {
    slug: 't-34-85',
    name: 'Т-34-85',
    nation: 'ussr',
    type: 'mediumTank',
    tier: 6,
    winRate: 49.8,
    avgDamage: 986,
    moe3: 1_890,
    battles: 2_604_338,
    isPremium: false
  },
  {
    slug: 'tiger-i',
    name: 'Tiger I',
    nation: 'germany',
    type: 'heavyTank',
    tier: 7,
    winRate: 49.1,
    avgDamage: 1_302,
    moe3: 2_310,
    battles: 1_911_742,
    isPremium: false
  },
  {
    slug: 'object-780',
    name: 'Объект 780',
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    winRate: 51.02,
    avgDamage: 3_250,
    moe3: 4_690,
    battles: 402_218,
    isPremium: false
  },
  {
    slug: 'kpz-50-t',
    name: 'Kpz 50 t',
    nation: 'germany',
    type: 'mediumTank',
    tier: 9,
    winRate: 52.3,
    avgDamage: 2_280,
    moe3: 3_540,
    battles: 523_004,
    isPremium: true
  },
  {
    slug: 'ae-phase-i',
    name: 'Концепт 1Б',
    nation: 'intunion',
    type: 'mediumTank',
    tier: 9,
    winRate: 50.44,
    avgDamage: 2_410,
    moe3: 3_705,
    battles: 302_118,
    isPremium: true
  }
];

export const MOCK_TANKS: MockTank[] = TANKS.map((tank, index) => ({
  ...tank,
  id: 1_000 + index * 256,
  images: mockVehicleImages(tank.name),
  trend: mockSeries({ seed: 501 + index, length: 30, base: tank.winRate, amplitude: 0.6 }).map((point) => point.value)
}));
