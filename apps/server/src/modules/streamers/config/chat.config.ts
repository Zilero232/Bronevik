export const CHAT_COMMANDS = ['stat', 'session', 'marks'] as const;

export const CHAT_COPY = {
  files: {
    ru: new URL('./locales/ru.ftl', import.meta.url),
    en: new URL('./locales/en.ftl', import.meta.url)
  },
  missing: 'none',
  messages: {
    stat: 'chat-stat',
    session: 'chat-session',
    sessionNone: 'chat-session-none',
    marks: 'chat-marks',
    challengeActive: 'chat-challenge-active',
    challengeSucceeded: 'chat-challenge-succeeded',
    challengeFailed: 'chat-challenge-failed',
    challengeExpired: 'chat-challenge-expired'
  }
} as const;
