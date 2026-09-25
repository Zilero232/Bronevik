import type { OverlayConfig } from '@bronevik/schemas';
import type { LucideIcon } from 'lucide-react';

import { overlayConfigSchema } from '@bronevik/schemas';
import { MessageSquareText, MonitorPlay, Swords, UserRound } from 'lucide-react';

export const DEMO_OVERLAY = {
  tickMs: 2_600,
  loop: 12,
  startSeconds: 4_980,
  code: '#K7Q2M',
  battles: 11,
  winShare: 0.6,
  avgDamage: 3_020,
  wn8: 3_180,
  moePercent: 86.2,
  challengeTarget: 3_000,
  challengeBattles: 3,
  tanks: ['Kranvagn', 'E 100', 'Leopard 1', 'Progetto 65'],
  damage: [4_210, 1_980, 5_340, 3_120, 2_760, 6_080]
} as const;

export const DEMO_CONFIG: OverlayConfig = overlayConfigSchema.parse({
  theme: 'steel',
  layout: 'grid',
  metrics: ['battles', 'winRate', 'wn8', 'lastBattle'],
  fontScale: 0.9
});

export const LANDING_ANCHORS = {
  flow: 'challenge-flow'
} as const;

export const CHAT_COMMANDS = ['stat', 'session', 'marks'] as const;

export const FLOW_STEPS = ['donate', 'verify', 'result'] as const;

export const TOOL_CARDS = [
  { key: 'challenges', icon: Swords },
  { key: 'overlays', icon: MonitorPlay },
  { key: 'commands', icon: MessageSquareText },
  { key: 'page', icon: UserRound }
] as const satisfies readonly { key: string; icon: LucideIcon }[];

export type ToolKey = (typeof TOOL_CARDS)[number]['key'];

export const DEMO_SLUG = 'stalevar';
