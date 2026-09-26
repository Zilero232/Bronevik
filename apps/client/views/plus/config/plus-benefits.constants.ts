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
  ] as const satisfies readonly { id: string; icon: LucideIcon }[],
  items: [
    { id: 'capacity', isLive: true },
    { id: 'apiLimits', isLive: true },
    { id: 'history', isLive: false },
    { id: 'analytics', isLive: false },
    { id: 'moeTracker', isLive: false },
    { id: 'mapAdvisor', isLive: false },
    { id: 'battleAnalysis', isLive: false },
    { id: 'aiCoach', isLive: false },
    { id: 'earlyAccess', isLive: false }
  ]
} as const;
