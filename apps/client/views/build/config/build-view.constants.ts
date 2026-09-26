import { createParser } from 'nuqs';

import { BUILD_URL, parseLoadout, serializeLoadout } from '@/entities/tank/build';

const loadoutParser = createParser({
  parse: parseLoadout,
  serialize: serializeLoadout,
  eq: (left, right) => serializeLoadout(left) === serializeLoadout(right)
});

export const LOADOUT_PARSERS = {
  [BUILD_URL.primary]: loadoutParser,
  [BUILD_URL.compare]: loadoutParser
};

export const BUILD_VIEW = {
  staleMs: 5 * 60 * 1000,
  maxSkillsPerRole: 3,
  summaryKeys: ['damagePerMinute', 'reloadTime', 'aimingTime', 'viewRange'],
  sides: ['a', 'b'],
  iconSize: { slot: 40, picker: 32, skill: 20, gear: 20 }
} as const;
