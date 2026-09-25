import type { MockTank } from './mocks.types';

import { mockSeries } from './series';
import { MOCK_TANKS } from './tanks';
import { mockVehicleImages } from './vehicle-images';

type VehicleSeed = [
  slug: string,
  name: string,
  nation: MockTank['nation'],
  type: MockTank['type'],
  tier: MockTank['tier'],
  isPremium: boolean,
  winRate: number,
  avgDamage: number,
  moe3: number,
  battles: number
];

const EXTRA: VehicleSeed[] = [
  ['object-277', 'Объект 277', 'ussr', 'heavyTank', 10, false, 51.9, 3_280, 4_760, 1_302_441],
  ['is-4', 'ИС-4', 'ussr', 'heavyTank', 10, false, 49.9, 2_990, 4_380, 702_115],
  ['st-ii', 'СТ-II', 'ussr', 'heavyTank', 10, false, 50.4, 3_120, 4_540, 388_902],
  ['object-268', 'Объект 268', 'ussr', 'AT-SPG', 10, false, 49.3, 3_210, 4_620, 512_774],
  ['object-268-4', 'Объект 268 Вариант 4', 'ussr', 'AT-SPG', 10, false, 51.4, 3_490, 4_910, 601_332],
  ['object-430u', 'Объект 430У', 'ussr', 'mediumTank', 10, false, 51.2, 3_010, 4_330, 802_004],
  ['t-62a', 'Т-62А', 'ussr', 'mediumTank', 10, false, 50.1, 2_820, 4_150, 690_117],
  ['is-3', 'ИС-3', 'ussr', 'heavyTank', 8, false, 49.7, 1_880, 2_980, 1_904_331],
  ['kv-1', 'КВ-1', 'ussr', 'heavyTank', 5, false, 50.8, 610, 1_310, 1_222_018],
  ['t-44', 'Т-44', 'ussr', 'mediumTank', 8, false, 49.9, 1_702, 2_760, 802_551],
  ['is-6', 'ИС-6', 'ussr', 'heavyTank', 8, true, 50.6, 1_815, 2_902, 1_011_227],
  ['object-907', 'Объект 907', 'ussr', 'mediumTank', 10, true, 52.4, 3_060, 4_410, 188_004],
  ['e-100', 'E 100', 'germany', 'heavyTank', 10, false, 49.8, 3_160, 4_640, 802_774],
  ['maus', 'Maus', 'germany', 'heavyTank', 10, false, 50.2, 3_040, 4_520, 612_004],
  ['e-50-m', 'E 50 Ausf. M', 'germany', 'mediumTank', 10, false, 50.3, 2_910, 4_300, 902_663],
  ['leopard-1', 'Leopard 1', 'germany', 'mediumTank', 10, false, 49.6, 2_860, 4_280, 812_907],
  ['jagdpanzer-e-100', 'Jagdpanzer E 100', 'germany', 'AT-SPG', 10, false, 49.5, 3_380, 4_890, 488_442],
  ['pz-kpfw-vii', 'Pz.Kpfw. VII', 'germany', 'heavyTank', 10, false, 50.1, 3_120, 4_590, 402_883],
  ['tiger-ii', 'Tiger II', 'germany', 'heavyTank', 8, false, 48.9, 1_812, 2_940, 1_404_225],
  ['panther', 'Panther', 'germany', 'mediumTank', 7, false, 49.2, 1_280, 2_240, 1_022_118],
  ['rhm-pzw', 'Rheinmetall Panzerwagen', 'germany', 'lightTank', 10, false, 50.2, 2_190, 3_920, 402_551],
  ['lowe', 'Löwe', 'germany', 'heavyTank', 8, true, 49.4, 1_902, 2_990, 702_334],
  ['m48-patton', 'M48A5 Patton', 'usa', 'mediumTank', 10, false, 50.5, 2_890, 4_260, 1_012_804],
  ['t57-heavy', 'T57 Heavy Tank', 'usa', 'heavyTank', 10, false, 50.6, 3_190, 4_600, 702_441],
  ['m-v-y', 'M-V-Y', 'usa', 'heavyTank', 10, false, 52.1, 3_210, 4_630, 612_992],
  ['t110e4', 'T110E4', 'usa', 'AT-SPG', 10, false, 49.6, 3_240, 4_710, 402_117],
  ['xm551-sheridan', 'XM551 Sheridan', 'usa', 'lightTank', 10, false, 50.0, 2_230, 3_960, 588_310],
  ['t32', 'T32', 'usa', 'heavyTank', 8, false, 49.3, 1_760, 2_870, 702_990],
  ['m4-sherman', 'M4 Sherman', 'usa', 'mediumTank', 5, false, 50.3, 590, 1_280, 1_402_551],
  ['super-conqueror', 'Super Conqueror', 'uk', 'heavyTank', 10, false, 51.7, 3_150, 4_570, 1_104_227],
  ['fv215b', 'FV215b', 'uk', 'heavyTank', 10, false, 50.2, 3_090, 4_480, 488_010],
  ['centurion-ax', 'Centurion Action X', 'uk', 'mediumTank', 10, false, 50.4, 2_880, 4_240, 790_334],
  ['fv217-badger', 'FV217 Badger', 'uk', 'AT-SPG', 10, false, 50.0, 3_190, 4_660, 402_702],
  ['caernarvon', 'Caernarvon', 'uk', 'heavyTank', 8, false, 49.8, 1_830, 2_920, 612_115],
  ['amx-30-b', 'AMX 30 B', 'france', 'mediumTank', 10, false, 49.7, 2_870, 4_230, 402_118],
  ['amx-50-b', 'AMX 50 B', 'france', 'heavyTank', 10, false, 49.9, 3_020, 4_400, 588_004],
  ['bat-chat-25t', 'Bat.-Châtillon 25 t', 'france', 'mediumTank', 10, false, 50.3, 2_810, 4_190, 1_002_441],
  ['amx-13-105', 'AMX 13 105', 'france', 'lightTank', 10, false, 49.9, 2_140, 3_870, 604_551],
  ['wz-111-5a', 'WZ-111 model 5A', 'china', 'heavyTank', 10, false, 50.7, 3_130, 4_560, 702_004],
  ['121b', '121B', 'china', 'mediumTank', 10, true, 50.9, 2_900, 4_220, 290_115],
  ['wz-113g-ft', 'WZ-113G FT', 'china', 'AT-SPG', 10, false, 49.7, 3_220, 4_690, 302_441],
  ['stb-1', 'STB-1', 'japan', 'mediumTank', 10, false, 49.8, 2_850, 4_240, 402_990],
  ['type-5-heavy', 'Type 5 Heavy', 'japan', 'heavyTank', 10, false, 50.4, 3_320, 4_790, 488_118],
  ['vz-55', 'Vz. 55', 'czech', 'heavyTank', 10, false, 51.3, 3_240, 4_680, 690_551],
  ['emil-ii', 'Emil II', 'sweden', 'heavyTank', 9, false, 49.6, 2_230, 3_460, 402_004],
  ['udes-15-16', 'UDES 15/16', 'sweden', 'mediumTank', 10, false, 49.9, 2_880, 4_260, 388_227],
  ['cs-63', 'CS-63', 'poland', 'mediumTank', 10, false, 51.2, 2_960, 4_320, 712_551],
  ['50tp', '50TP Tyszkiewicza', 'poland', 'heavyTank', 9, false, 50.1, 2_250, 3_480, 402_331],
  ['rinoceronte', 'Rinoceronte', 'italy', 'heavyTank', 10, false, 49.9, 3_150, 4_560, 312_004],
  ['minotauro', 'Minotauro', 'italy', 'AT-SPG', 10, false, 50.3, 3_310, 4_780, 288_441],
  ['concept-5', 'Концепт 5', 'intunion', 'heavyTank', 10, false, 50.8, 3_180, 4_600, 188_220],
  ['gw-e-100', 'G.W. E 100', 'germany', 'SPG', 10, false, 49.3, 2_020, 3_380, 302_118],
  ['t92-hmc', 'T92 HMC', 'usa', 'SPG', 10, false, 49.1, 2_180, 3_540, 402_775],
  ['conqueror-gc', 'Conqueror Gun Carriage', 'uk', 'SPG', 10, false, 49.5, 2_090, 3_410, 288_551],
  ['bourrasque', 'Bourrasque', 'france', 'mediumTank', 8, true, 51.1, 1_780, 2_830, 902_334],
  ['defender', 'Defender', 'ussr', 'heavyTank', 8, true, 50.2, 1_860, 2_950, 1_202_118]
];

const extras: MockTank[] = EXTRA.map(([slug, name, nation, type, tier, isPremium, winRate, avgDamage, moe3, battles], index) => ({
  id: 60_000 + index * 256,
  slug,
  name,
  nation,
  type,
  tier,
  isPremium,
  winRate,
  avgDamage,
  moe3,
  battles,
  images: mockVehicleImages(name),
  trend: mockSeries({ seed: 901 + index, length: 30, base: winRate, amplitude: 0.6 }).map((point) => point.value)
}));

export const MOCK_VEHICLES: MockTank[] = [...MOCK_TANKS, ...extras];
