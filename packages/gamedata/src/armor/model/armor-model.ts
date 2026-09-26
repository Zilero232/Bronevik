import type { ArmorFlag, ArmorPieceKind, HasArmorFlagInput } from './armor-model.types';

import { ARMOR_FLAGS } from './armor-model.constants';

export const hasArmorFlag = ({ flags, flag }: HasArmorFlagInput): boolean => (flags & ARMOR_FLAGS[flag]) !== 0;

export const armorFlags = (flags: readonly ArmorFlag[]): number => flags.reduce((mask, flag) => mask | ARMOR_FLAGS[flag], 0);

const PIECE_PREFIXES: readonly [string, ArmorPieceKind][] = [
  ['chassis', 'chassis'],
  ['hull', 'hull'],
  ['turret', 'turret'],
  ['gun', 'gun']
];

export const armorPieceKind = (piece: string): ArmorPieceKind | undefined =>
  PIECE_PREFIXES.find(([prefix]) => piece.toLowerCase().startsWith(prefix))?.[1];
