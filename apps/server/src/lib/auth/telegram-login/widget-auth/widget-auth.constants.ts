export const WIDGET_AUTH = {
  hashField: 'hash',
  separator: '\n',
  maxAgeSeconds: 86_400,
  telegramId: /^\d{1,19}$/
} as const;
