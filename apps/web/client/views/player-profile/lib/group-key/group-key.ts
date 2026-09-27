import { TANK_CLASSES, TIERS } from '@otmetki/icons';

import type { GroupKey } from './group-key.types';

export const groupKeyOf = (key: string): GroupKey => {
  const type = TANK_CLASSES.find((value) => value === key);

  if (type) {
    return { kind: 'class', type };
  }

  const tier = TIERS.find((value) => String(value) === key);

  return tier ? { kind: 'tier', tier } : { kind: 'raw', key };
};
