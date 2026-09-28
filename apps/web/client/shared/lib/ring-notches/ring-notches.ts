import { round } from 'remeda';

import type { RingNotch, RingNotchesInput } from './ring-notches.types';

import { RING_NOTCHES } from './ring-notches.constants';

const point = (value: number) => round(value, RING_NOTCHES.precision);

export const ringNotches = ({ size, thickness, percents, overshoot = RING_NOTCHES.defaultOvershoot }: RingNotchesInput): RingNotch[] => {
  const center = size / 2;
  const outer = center;
  const inner = Math.max(center - thickness - overshoot, 0);

  return percents.map((percent) => {
    const angle = (percent / 100) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
      percent,
      x1: point(center + cos * inner),
      y1: point(center + sin * inner),
      x2: point(center + cos * outer),
      y2: point(center + sin * outer)
    };
  });
};
