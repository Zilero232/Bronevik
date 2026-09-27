import type { ArmorShell } from '@otmetki/gamedata';
import type { ArmorShellOptionData } from '@otmetki/schemas';

import { penetrationAtDistance, toShellKind } from '@otmetki/gamedata';

import type { PickShellInput, ResolveShellInput } from './shell-options.types';

export const pickShell = ({ gun, shellName }: PickShellInput): ArmorShellOptionData | undefined =>
  gun?.shells.find(({ name }) => name === shellName) ?? gun?.shells[0];

export const resolveShell = ({ option, distance }: ResolveShellInput): ArmorShell => {
  const kind = toShellKind(option.kind);

  return {
    kind,
    caliber: option.caliber,
    penetration: penetrationAtDistance({ kind, at100m: option.penetration.at100m, at500m: option.penetration.at500m, distance })
  };
};
