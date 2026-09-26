import { OnslaughtIcon, RandomBattleIcon } from '@bronevik/icons';
import { Flag, Gamepad2, Swords } from 'lucide-react';

export const MODE_ICON = {
  kinds: {
    standard: RandomBattleIcon,
    encounter: Swords,
    assault: Flag,
    onslaught: OnslaughtIcon
  },
  fallback: Gamepad2,
  size: 16
} as const;
