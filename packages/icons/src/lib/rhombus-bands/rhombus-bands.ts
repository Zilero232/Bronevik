import { round } from 'remeda';

import type { RhombusBandsInput, RhombusPointInput } from '../icon';

const point = ({ cx, cy, halfWidth, halfHeight, s, t }: RhombusPointInput) =>
  `${round(cx + (halfWidth * (s + t)) / 2, 2)} ${round(cy + (halfHeight * (t - s)) / 2, 2)}`;

export const rhombusBands = ({ bands, gap, ...shape }: RhombusBandsInput) => {
  const count = Math.max(1, Math.floor(bands));
  const step = gap * Math.hypot(1 / shape.halfWidth, 1 / shape.halfHeight);
  const width = (2 - step * (count - 1)) / count;

  return Array.from({ length: count }, (_, index) => {
    const start = -1 + index * (width + step);
    const end = start + width;

    return `M${point({ ...shape, s: start, t: -1 })}L${point({ ...shape, s: end, t: -1 })}L${point({ ...shape, s: end, t: 1 })}L${point({ ...shape, s: start, t: 1 })}Z`;
  });
};
