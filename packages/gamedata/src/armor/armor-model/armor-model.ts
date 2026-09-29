import type { ArmorFlag, ArmorGunOption, ArmorPieceKind, HasArmorFlagInput, ListArmorGunsInput } from './armor-model.types';

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

export const listArmorGuns = ({ turrets }: ListArmorGunsInput): ArmorGunOption[] => {
  const guns = new Map<string, ArmorGunOption>();

  for (const { name, displayName, shells } of turrets.flatMap((turret) => turret.guns)) {
    if (!guns.has(name)) {
      guns.set(name, { name, displayName, shells });
    }
  }

  return [...guns.values()];
};
