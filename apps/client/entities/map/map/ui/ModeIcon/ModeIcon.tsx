import { OnslaughtIcon, RandomBattleIcon } from '@bronevik/icons';
import { Flag, Gamepad2, Swords } from 'lucide-react';

import type { ModeIconProps } from './ModeIcon.types';

import { mapModeKind } from '../../lib/map-mode';

const ICONS = {
  standard: RandomBattleIcon,
  encounter: Swords,
  assault: Flag,
  onslaught: OnslaughtIcon
} as const;

export const ModeIcon = ({ mode, size = 16 }: ModeIconProps) => {
  const kind = mapModeKind(mode);
  const Icon = kind ? ICONS[kind] : Gamepad2;

  return <Icon aria-hidden size={size} />;
};
