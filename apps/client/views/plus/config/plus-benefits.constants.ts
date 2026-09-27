import type { LucideIcon } from 'lucide-react';

import { FileDown, MonitorPlay, Palette, TrendingUp, Trophy, Zap } from 'lucide-react';

export const PLUS_BENEFITS = {
  featured: [
    { id: 'priorityPolling', icon: Zap },
    { id: 'overlays', icon: MonitorPlay },
    { id: 'progression', icon: TrendingUp },
    { id: 'privateCompetitions', icon: Trophy },
    { id: 'analyticsExport', icon: FileDown },
    { id: 'cosmetics', icon: Palette }
  ] as const satisfies readonly { id: string; icon: LucideIcon }[]
} as const;

export const PLUS_LIMIT_TIERS = ['free', 'plus'] as const;
