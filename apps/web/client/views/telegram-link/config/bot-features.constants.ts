export const BOT_FEATURES = {
  commands: ['me', 'session', 'marks', 'clan', 'tank'] as const,
  alerts: ['mark', 'threshold', 'session', 'bonus', 'sale'] as const,
  steps: ['open', 'send', 'done'] as const
} as const;
