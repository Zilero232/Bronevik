import type { ResolveStrokeInput } from '../icon';

import { ICON_DEFAULTS } from '../icon';

export const resolveStroke = ({ size, strokeWidth, absoluteStrokeWidth }: ResolveStrokeInput) => {
  if (!absoluteStrokeWidth) {
    return strokeWidth;
  }

  return (Number(strokeWidth) * ICON_DEFAULTS.viewBox) / Number(size);
};
