import { clamp } from 'remeda';

import type { RadialDash, RadialInput } from './radial.types';

export const radialDash = ({ progress, radius }: RadialInput): RadialDash => {
  const circumference = 2 * Math.PI * radius;
  const done = clamp(progress, { min: 0, max: 1 });

  return {
    dasharray: `${circumference.toFixed(2)} ${circumference.toFixed(2)}`,
    dashoffset: Number((circumference * (1 - done)).toFixed(2)),
    circumference
  };
};
