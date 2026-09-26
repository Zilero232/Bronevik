import type { OverlayKind } from '@otmetki/schemas';
import type { LucideIcon } from 'lucide-react';

import { MessageSquareText, MonitorPlay, Swords, UserRound } from 'lucide-react';

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

export const MONITOR_WIDGETS = ['session', 'wn8', 'moe', 'damage', 'win_rate', 'challenge'] as const satisfies readonly OverlayKind[];
