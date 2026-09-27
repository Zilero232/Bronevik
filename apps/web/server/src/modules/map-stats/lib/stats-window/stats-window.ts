import { subDays } from 'date-fns';

import type { StatsWindow, StatsWindowInput } from './stats-window.types';

export const statsWindow = ({ now, days }: StatsWindowInput): StatsWindow => ({ from: subDays(now, days), to: now });
