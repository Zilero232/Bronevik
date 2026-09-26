import type { RingNotch, RingNotchesInput } from './ring-notches.types';

export const ringNotches = ({ size, thickness, percents, overshoot = 2 }: RingNotchesInput): RingNotch[] => {
  const center = size / 2;
  const outer = center;
  const inner = Math.max(center - thickness - overshoot, 0);

  return percents.map((percent) => {
    const angle = (percent / 100) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return { percent, x1: center + cos * inner, y1: center + sin * inner, x2: center + cos * outer, y2: center + sin * outer };
  });
};
