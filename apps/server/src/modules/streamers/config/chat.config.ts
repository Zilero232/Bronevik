export const CHAT_COMMANDS = ['stat', 'session', 'marks'] as const;

export const CHAT_COPY = {
  ru: {
    stat: '{nickname}: WN8 {wn8}, побед {winRate}%, боёв {battles}',
    session: 'Сессия {nickname}: {battles} боёв, побед {winRate}%, средний урон {avgDamage}',
    sessionNone: 'У {nickname} пока нет сессии',
    marks: '{nickname}: 3 отм. — {moe3}, 2 отм. — {moe2}, 1 отм. — {moe1}',
    challengeActive: 'Челлендж «{title}» принят от {donor}! Условие проверит мод Броневика.',
    challengeSucceeded: 'Челлендж «{title}» выполнен! 🎉',
    challengeFailed: 'Челлендж «{title}» провален.',
    challengeExpired: 'Время на челлендж «{title}» вышло.',
    missing: '—'
  },
  en: {
    stat: '{nickname}: WN8 {wn8}, {winRate}% wins, {battles} battles',
    session: '{nickname} session: {battles} battles, {winRate}% wins, {avgDamage} avg damage',
    sessionNone: '{nickname} has no session yet',
    marks: '{nickname}: 3 marks — {moe3}, 2 marks — {moe2}, 1 mark — {moe1}',
    challengeActive: 'Challenge "{title}" accepted from {donor}! The Bronevik mod will verify it.',
    challengeSucceeded: 'Challenge "{title}" completed! 🎉',
    challengeFailed: 'Challenge "{title}" failed.',
    challengeExpired: 'Time is up for challenge "{title}".',
    missing: '—'
  }
} as const;
