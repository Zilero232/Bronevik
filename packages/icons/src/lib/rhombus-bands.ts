import { round } from 'remeda';

import type { RhombusBandsInput } from './icon.types';

const point = ({ cx, cy, halfWidth, halfHeight }: Omit<RhombusBandsInput, 'bands' | 'gap'>, s: number, t: number) =>
  `${round(cx + (halfWidth * (s + t)) / 2, 2)} ${round(cy + (halfHeight * (t - s)) / 2, 2)}`;

export const rhombusBands = ({ bands, gap, ...shape }: RhombusBandsInput) => {
  const count = Math.max(1, Math.floor(bands));
  const step = gap * Math.hypot(1 / shape.halfWidth, 1 / shape.halfHeight);
  const width = (2 - step * (count - 1)) / count;

  return Array.from({ length: count }, (_, index) => {
    const start = -1 + index * (width + step);
    const end = start + width;

    return `M${point(shape, start, -1)}L${point(shape, end, -1)}L${point(shape, end, 1)}L${point(shape, start, 1)}Z`;
  });
};
