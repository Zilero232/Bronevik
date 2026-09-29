import { parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs/server';

import { ARMOR_INSPECT, ARMOR_LAYERS, RANDOMNESS_KEYS } from './armor-inspect.constants';

export const ARMOR_ATTACK_URL_PARSERS = {
  attacker: parseAsString,
  gun: parseAsString,
  shell: parseAsString,
  distance: parseAsInteger.withDefault(ARMOR_INSPECT.distance.initial),
  rng: parseAsStringLiteral(RANDOMNESS_KEYS).withDefault('lesta'),
  layers: parseAsArrayOf(parseAsStringLiteral(ARMOR_LAYERS)).withDefault([...ARMOR_LAYERS]),
  heatmap: parseAsBoolean.withDefault(false)
} as const;

export const ARMOR_HEAT_LEGEND = {
  stops: [0, 0.5, 1],
  fixedClasses: ['ricochet', 'spaced', 'module', 'hollow']
} as const;
