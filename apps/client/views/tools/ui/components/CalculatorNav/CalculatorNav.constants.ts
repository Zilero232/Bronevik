import type { LucideIcon } from 'lucide-react';

import { Coins, FlaskConical, Gem, Medal, Target, Ticket, Users } from 'lucide-react';

import type { CalculatorId } from '../../../config';

export const CALCULATOR_ICONS: Record<CalculatorId, LucideIcon> = {
  research: FlaskConical,
  target: Target,
  moe: Medal,
  crew: Users,
  economy: Coins,
  gold: Gem,
  pass: Ticket
};
