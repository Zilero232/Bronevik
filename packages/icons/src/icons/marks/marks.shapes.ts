import type { MarkCount } from '../icons.types';

import { starPath } from '../../lib';

const STAR_X: Record<MarkCount, number[]> = {
  1: [12],
  2: [8.5, 15.5],
  3: [5.5, 12, 18.5]
};

const STRIPE_X = [4.5, 7, 9.5] as const;

const RING_X = [4.4, 7.6, 10.8] as const;

export const MARK_SHAPES = {
  barrel: 'M2 14.5h12v3.5H2',
  brake: 'M14 13h4.5v6.5H14zM18.5 16.2H22',
  stars: (marks: MarkCount) => STAR_X[marks].map((cx) => starPath({ cx, cy: 7.2, outer: 3.4, inner: 1.45 })),
  stripes: (marks: MarkCount) => STRIPE_X.slice(0, marks).map((x) => `M${x} 14.5v3.5`)
} as const;

export const RING_SHAPES = {
  barrel: 'M2 10.2h12.5v3.6H2',
  brake: 'M14.5 8.6h4.5v6.8h-4.5zM19 12H22',
  rings: (marks: MarkCount) => RING_X.slice(0, marks).map((x) => `M${x} 7.8v8.4`)
} as const;
