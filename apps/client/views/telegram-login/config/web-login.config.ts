import type { LucideIcon } from 'lucide-react';

import { CircleCheck, CircleSlash, KeyRound, LoaderCircle, TimerOff } from 'lucide-react';

import type { WebLoginPhase } from '../lib/web-login';

export const WEB_LOGIN = {
  param: 'code',
  botCommand: '/login'
} as const;

export const PHASE_VIEW: Record<WebLoginPhase, { icon: LucideIcon; tone: 'accent' | 'bad' | 'good' | 'steel' }> = {
  missing: { icon: KeyRound, tone: 'steel' },
  invalid: { icon: CircleSlash, tone: 'bad' },
  redeeming: { icon: LoaderCircle, tone: 'accent' },
  failed: { icon: TimerOff, tone: 'bad' },
  success: { icon: CircleCheck, tone: 'good' }
};
