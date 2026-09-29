import { Gamepad2, Map as MapIcon } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

export const TOOL_GAMES = [
  { key: 'guessTank', href: ROUTES.play.guessTank, icon: Gamepad2 },
  { key: 'guessMap', href: ROUTES.play.guessMap, icon: MapIcon }
] as const;
