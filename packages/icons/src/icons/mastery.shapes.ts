import type { MasteryLevel } from './icons.types';

import { starPath } from '../lib';

const chevron = (y: number) => `M8 ${y}l4 3 4-3`;

export const MASTERY = {
  shield: 'M12 2.5 20 5.5v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z',
  glow: 'drop-shadow(0 0 2px var(--bronevik-icon-accent, #ff6b1a))',
  fillOpacity: 0.16
} as const;

export const MASTERY_EMBLEM = {
  third: [chevron(10)],
  second: [chevron(8.2), chevron(12.2)],
  first: [chevron(6.6), chevron(10.3), chevron(14)],
  master: [starPath({ cx: 12, cy: 11.4, outer: 4.8, inner: 2 })]
} as const satisfies Record<MasteryLevel, string[]>;

export const MASTERY_TINTS = {
  third: 'var(--bronevik-mastery-third, #b0714a)',
  second: 'var(--bronevik-mastery-second, #aeb6bf)',
  first: 'var(--bronevik-mastery-first, #e0b24c)',
  master: 'var(--bronevik-mastery-master, #e0b24c)'
} as const satisfies Record<MasteryLevel, string>;
