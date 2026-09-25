import type { VehicleType } from '@bronevik/schemas';

import type { NationIconComponent, TankClassIconComponent } from './icons/icons.types';
import type { IconComponent } from './lib';

import {
  HeavyTankSilhouetteIcon,
  LightTankSilhouetteIcon,
  MediumTankSilhouetteIcon,
  SpgSilhouetteIcon,
  TankDestroyerSilhouetteIcon
} from './icons/class-silhouettes';
import { HeavyTankIcon, LightTankIcon, MediumTankIcon, SpgIcon, TankDestroyerIcon } from './icons/classes';
import { BronevikLogoIcon } from './icons/logo';
import { Mark1Icon, Mark2Icon, Mark3Icon } from './icons/marks';
import { MasteryFirstIcon, MasteryMasterIcon, MasterySecondIcon, MasteryThirdIcon } from './icons/mastery';
import { ArmorIcon, CrosshairIcon, RadioIcon, ShellApcrIcon, ShellApIcon, ShellHeatIcon, ShellHeIcon, SpottingIcon, TracerIcon } from './icons/misc';
import { FrontlineIcon, GlobalMapIcon, OnslaughtIcon, RandomBattleIcon, RankedBattleIcon, StrongholdIcon, TrainingIcon } from './icons/modes';
import {
  ChinaIcon,
  CzechIcon,
  FranceIcon,
  GermanyIcon,
  IntUnionIcon,
  ItalyIcon,
  JapanIcon,
  PolandIcon,
  SwedenIcon,
  UkIcon,
  UsaIcon,
  UssrIcon
} from './icons/nations';

export const TANK_CLASSES = ['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG'] as const satisfies readonly VehicleType[];

export type TankClass = VehicleType;

export const NATIONS = ['ussr', 'germany', 'usa', 'china', 'france', 'uk', 'japan', 'czech', 'sweden', 'poland', 'italy', 'intunion'] as const;

export type Nation = (typeof NATIONS)[number];

const KNOWN_NATIONS: readonly string[] = NATIONS;

export const isNation = (value: string): value is Nation => KNOWN_NATIONS.includes(value);

export const GAME_MODES = ['random', 'ranked', 'onslaught', 'frontline', 'stronghold', 'globalmap', 'training'] as const;

export type GameMode = (typeof GAME_MODES)[number];

export const TANK_CLASS_ICONS: Record<VehicleType, TankClassIconComponent> = {
  lightTank: LightTankIcon,
  mediumTank: MediumTankIcon,
  heavyTank: HeavyTankIcon,
  'AT-SPG': TankDestroyerIcon,
  SPG: SpgIcon
};

export const TANK_CLASS_SILHOUETTES: Record<VehicleType, IconComponent> = {
  lightTank: LightTankSilhouetteIcon,
  mediumTank: MediumTankSilhouetteIcon,
  heavyTank: HeavyTankSilhouetteIcon,
  'AT-SPG': TankDestroyerSilhouetteIcon,
  SPG: SpgSilhouetteIcon
};

export const NATION_ICONS: Record<Nation, NationIconComponent> = {
  ussr: UssrIcon,
  germany: GermanyIcon,
  usa: UsaIcon,
  china: ChinaIcon,
  france: FranceIcon,
  uk: UkIcon,
  japan: JapanIcon,
  czech: CzechIcon,
  sweden: SwedenIcon,
  poland: PolandIcon,
  italy: ItalyIcon,
  intunion: IntUnionIcon
};

export const GAME_MODE_ICONS: Record<GameMode, IconComponent> = {
  random: RandomBattleIcon,
  ranked: RankedBattleIcon,
  onslaught: OnslaughtIcon,
  frontline: FrontlineIcon,
  stronghold: StrongholdIcon,
  globalmap: GlobalMapIcon,
  training: TrainingIcon
};

export const ICONS = {
  'bronevik-logo': BronevikLogoIcon,
  'class-light': LightTankIcon,
  'class-medium': MediumTankIcon,
  'class-heavy': HeavyTankIcon,
  'class-td': TankDestroyerIcon,
  'class-spg': SpgIcon,
  'silhouette-light': LightTankSilhouetteIcon,
  'silhouette-medium': MediumTankSilhouetteIcon,
  'silhouette-heavy': HeavyTankSilhouetteIcon,
  'silhouette-td': TankDestroyerSilhouetteIcon,
  'silhouette-spg': SpgSilhouetteIcon,
  'nation-ussr': UssrIcon,
  'nation-germany': GermanyIcon,
  'nation-usa': UsaIcon,
  'nation-china': ChinaIcon,
  'nation-france': FranceIcon,
  'nation-uk': UkIcon,
  'nation-japan': JapanIcon,
  'nation-czech': CzechIcon,
  'nation-sweden': SwedenIcon,
  'nation-poland': PolandIcon,
  'nation-italy': ItalyIcon,
  'nation-intunion': IntUnionIcon,
  'mark-1': Mark1Icon,
  'mark-2': Mark2Icon,
  'mark-3': Mark3Icon,
  'mastery-third': MasteryThirdIcon,
  'mastery-second': MasterySecondIcon,
  'mastery-first': MasteryFirstIcon,
  'mastery-master': MasteryMasterIcon,
  'mode-random': RandomBattleIcon,
  'mode-ranked': RankedBattleIcon,
  'mode-onslaught': OnslaughtIcon,
  'mode-frontline': FrontlineIcon,
  'mode-stronghold': StrongholdIcon,
  'mode-globalmap': GlobalMapIcon,
  'mode-training': TrainingIcon,
  tracer: TracerIcon,
  'shell-ap': ShellApIcon,
  'shell-he': ShellHeIcon,
  'shell-heat': ShellHeatIcon,
  'shell-apcr': ShellApcrIcon,
  armor: ArmorIcon,
  spotting: SpottingIcon,
  radio: RadioIcon,
  crosshair: CrosshairIcon
} as const satisfies Record<string, IconComponent>;

export type IconName = keyof typeof ICONS;

export const ICON_GROUPS = {
  brand: ['bronevik-logo'],
  classes: ['class-light', 'class-medium', 'class-heavy', 'class-td', 'class-spg'],
  silhouettes: ['silhouette-light', 'silhouette-medium', 'silhouette-heavy', 'silhouette-td', 'silhouette-spg'],
  nations: [
    'nation-ussr',
    'nation-germany',
    'nation-usa',
    'nation-china',
    'nation-france',
    'nation-uk',
    'nation-japan',
    'nation-czech',
    'nation-sweden',
    'nation-poland',
    'nation-italy',
    'nation-intunion'
  ],
  marks: ['mark-1', 'mark-2', 'mark-3'],
  mastery: ['mastery-third', 'mastery-second', 'mastery-first', 'mastery-master'],
  modes: ['mode-random', 'mode-ranked', 'mode-onslaught', 'mode-frontline', 'mode-stronghold', 'mode-globalmap', 'mode-training'],
  misc: ['tracer', 'shell-ap', 'shell-he', 'shell-heat', 'shell-apcr', 'armor', 'spotting', 'radio', 'crosshair']
} as const satisfies Record<string, readonly IconName[]>;

export type IconGroup = keyof typeof ICON_GROUPS;
