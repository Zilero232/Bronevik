import type { WebLoginPhase } from '../lib/web-login';

export const WEB_LOGIN = {
  param: 'code',
  botCommand: '/login'
} as const;

export const WEB_LOGIN_PHASE_TONE = {
  missing: 'steel',
  confirm: 'accent',
  invalid: 'bad',
  redeeming: 'accent',
  failed: 'bad',
  success: 'good'
} as const satisfies Record<WebLoginPhase, 'accent' | 'bad' | 'good' | 'steel'>;
