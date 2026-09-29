import type { ArmorShell } from '@otmetki/gamedata';
import type { ArmorAttackerGunData, ArmorShellOptionData } from '@otmetki/schemas';

import { penetrationAtDistance, toShellKind } from '@otmetki/gamedata';

import type { PickGunInput, PickShellInput, ResolveShellInput } from './shell-options.types';

import { ARMOR_INSPECT } from '../../config';

export const pickGun = ({ guns, gunName, fallbackName }: PickGunInput): ArmorAttackerGunData | undefined =>
  guns.find(({ name }) => name === gunName) ?? guns.find(({ name }) => name === fallbackName) ?? guns.at(-1);

export const pickShell = ({ gun, shellName }: PickShellInput): ArmorShellOptionData | undefined =>
  gun?.shells.find(({ name }) => name === shellName) ?? gun?.shells[0];

export const clampDistance = (distance: number): number => Math.min(ARMOR_INSPECT.distance.max, Math.max(ARMOR_INSPECT.distance.min, distance));

export const resolveShell = ({ option, distance }: ResolveShellInput): ArmorShell => {
  const kind = toShellKind(option.kind);

  return {
    kind,
    caliber: option.caliber,
    penetration: penetrationAtDistance({ kind, at100m: option.penetration.at100m, at500m: option.penetration.at500m, distance })
  };
};
