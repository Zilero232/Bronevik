export const TELEGRAM_LINK = {
  pollMs: 3_000,
  tickMs: 1_000,
  startCommand: '/start'
} as const;

export const BOT_FEATURES = {
  commands: ['me', 'session', 'marks', 'clan', 'tank'] as const,
  alerts: ['mark', 'threshold', 'session', 'bonus', 'sale'] as const,
  steps: ['open', 'send', 'done'] as const
} as const;
