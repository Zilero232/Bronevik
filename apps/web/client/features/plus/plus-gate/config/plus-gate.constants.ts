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
  streamerAlerts: Radio,
  supertest: FlaskConical
} as const satisfies Record<PlusFeature, LucideIcon>;

export const PLUS_GATE = {
  iconSize: 18,
  skeletonHeight: 160,
  checkoutHash: '#checkout'
} as const;

export const PLUS_FEATURE_PREVIEW = {
  history: 'chart',
  analytics: 'chart',
  mapAdvisor: 'table',
  battleAnalysis: 'chart',
  aiCoach: 'cards',
  moeTracker: 'chart',
  priorityPolling: 'cards',
  progression: 'table',
  overlays: 'cards',
  cosmetics: 'cards',
  analyticsExport: 'table',
  apiLimits: 'table',
  earlyAccess: 'cards',
  hangarExtras: 'cards',
  privateCompetitions: 'table',
  streamerAlerts: 'cards',
  supertest: 'table'
} as const satisfies Record<PlusFeature, 'cards' | 'chart' | 'table'>;

export const PLUS_PREVIEW_SAMPLE = {
  chart: '0,70 12,62 24,66 36,48 48,54 60,36 72,40 84,24 96,30 108,14 120,20',
  rows: [92, 74, 61, 48],
  cards: [0, 1, 2]
} as const;
