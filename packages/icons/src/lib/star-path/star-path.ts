import { round } from 'remeda';

import type { StarPathInput } from '../icon';

export const starPath = ({ cx, cy, outer, inner = outer * 0.45, points = 5 }: StarPathInput) => {
  const step = Math.PI / points;

  const vertices = Array.from({ length: points * 2 }, (_, index) => {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = index * step - Math.PI / 2;

    return `${round(cx + radius * Math.cos(angle), 2)} ${round(cy + radius * Math.sin(angle), 2)}`;
  });

  return `M${vertices.join('L')}Z`;
};
