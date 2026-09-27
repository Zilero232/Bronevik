import { clamp } from 'remeda';

import type { RingGeometryInput } from './ring-geometry.types';

export const ringGeometry = ({ value, max, size, thickness }: RingGeometryInput) => ({
  ratio: max > 0 ? clamp(value / max, { min: 0, max: 1 }) : 0,
  radius: (size - thickness) / 2,
  center: size / 2
});
