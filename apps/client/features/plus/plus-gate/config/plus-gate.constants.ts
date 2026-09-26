import type { PlusFeature } from '@otmetki/schemas';
import type { LucideIcon } from 'lucide-react';

import {
  Bot,
  ChartLine,
  Crosshair,
  FileDown,
  FlaskConical,
  Gauge,
  History,
  LockKeyhole,
  Map,
  MonitorPlay,
  Radio,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Warehouse
} from 'lucide-react';

export const PLUS_FEATURE_ICONS = {
  history: History,
  analytics: ChartLine,
  mapAdvisor: Map,
  battleAnalysis: Crosshair,
  aiCoach: Bot,
  moeTracker: Target,
  priorityPolling: Timer,
  progression: TrendingUp,
  overlays: MonitorPlay,
  cosmetics: Sparkles,
  analyticsExport: FileDown,
  apiLimits: Gauge,
  earlyAccess: FlaskConical,
  hangarExtras: Warehouse,
  privateCompetitions: LockKeyhole,
  streamerAlerts: Radio
} as const satisfies Record<PlusFeature, LucideIcon>;

export const PLUS_GATE = {
  iconSize: 18,
  skeletonHeight: 160
} as const;
