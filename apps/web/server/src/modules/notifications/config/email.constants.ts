export const SMTP_TIMEOUTS = {
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 15_000
} as const;

export const EMAIL_THEME = {
  background: '#0f1115',
  card: '#181b22',
  text: '#e6e8ee',
  muted: '#9aa1b2',
  accent: '#e0a526',
  fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif'
} as const;
