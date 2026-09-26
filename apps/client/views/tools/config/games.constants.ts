import { Gamepad2 } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

export const TOOL_GAMES = [{ key: 'guessTank', href: ROUTES.play.guessTank, icon: Gamepad2 }] as const;
