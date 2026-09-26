import { BUILD_USAGE } from '@otmetki/schemas';
import { minutesToMilliseconds } from 'date-fns';
import { createParser, parseAsStringLiteral } from 'nuqs';

import { BUILD_PRESETS, BUILD_URL, parseLoadout, serializeLoadout } from '@/entities/tank/build';

const loadoutParser = createParser({
  parse: parseLoadout,
  serialize: serializeLoadout,
  eq: (left, right) => serializeLoadout(left) === serializeLoadout(right)
});

export const LOADOUT_PARSERS = {
  [BUILD_URL.primary]: loadoutParser,
  [BUILD_URL.compare]: loadoutParser
} as const;

export const BUILD_VIEW = {
  staleMs: minutesToMilliseconds(5),
  maxSkillsPerRole: 3,
  summaryKeys: ['damagePerMinute', 'reloadTime', 'aimingTime', 'viewRange'],
  sides: ['a', 'b'],
  iconSize: { slot: 40, picker: 32, skill: 20, gear: 20 }
} as const;

export const PRESET_PARSERS = {
  [BUILD_URL.preset]: parseAsStringLiteral(BUILD_PRESETS),
  [BUILD_URL.mode]: parseAsStringLiteral(BUILD_USAGE.modes).withDefault(BUILD_USAGE.defaultMode),
  [BUILD_URL.cohort]: parseAsStringLiteral(BUILD_USAGE.cohorts).withDefault(BUILD_USAGE.defaultCohort)
} as const;
