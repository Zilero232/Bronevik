import type { ResolveStrokeInput } from './icon.types';

import { ICON_DEFAULTS } from './icon.constants';

export const resolveStroke = ({ size, strokeWidth, absoluteStrokeWidth }: ResolveStrokeInput) => {
  if (!absoluteStrokeWidth) {
    return strokeWidth;
  }

  return (Number(strokeWidth) * ICON_DEFAULTS.viewBox) / Number(size);
};
