export const VK_COMMAND_ALIASES = {
  stats: ['stats', 'me', 'стата', 'статистика'],
  session: ['session', 'сессия'],
  marks: ['marks', 'отметки'],
  clan: ['clan', 'клан'],
  tank: ['tank', 'танк'],
  top: ['top', 'топ'],
  help: ['help', 'start', 'начать', 'помощь']
} as const;

export const VK_COMMAND_PATTERN = {
  mention: /^\[(?:club|public)\d+\|[^\]]*\]\s*[,:]?\s*/u,
  prefix: /^[/!]/u
} as const;
