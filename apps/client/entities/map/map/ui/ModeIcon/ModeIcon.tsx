import type { ModeIconProps } from './ModeIcon.types';

import { MODE_ICON } from '../../config';
import { mapModeKind } from '../../lib/map-mode';

export const ModeIcon = ({ mode, size = MODE_ICON.size }: ModeIconProps) => {
  const kind = mapModeKind(mode);
  const Icon = kind ? MODE_ICON.kinds[kind] : MODE_ICON.fallback;

  return <Icon aria-hidden size={size} />;
};
