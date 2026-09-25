export const NOTIFICATION_LOCALES = ['ru', 'en'] as const;

export const NOTIFICATION_LINKS = {
  player: '/p/{nickname}',
  tank: '/t/{tankId}',
  session: '/p/{nickname}?session={sessionId}',
  bonusCodes: '/shop',
  challenges: '/me',
  digest: '/me',
  clanWorkspace: '/clans/{clanId}/workspace',
  badges: '/me'
} as const;

export const NOTIFICATION_COPY = {
  ru: {
    moeGained: { title: 'Новая отметка!', body: '{nickname}: {marks}-я отметка на {tankName}' },
    moeGainedFollowed: { title: 'Друг взял отметку', body: '{nickname} получил {marks}-ю отметку на {tankName}' },
    moeThresholdDropped: { title: 'Порог отметки снизился', body: '{tankName}: {mark}-я отметка теперь {to} урона (было {from})' },
    sessionFinished: {
      title: 'Итоги сессии',
      body: '{nickname}: {battles} боёв, {winRate}% побед, {avgDamage} среднего урона, WN8 {wn8}'
    },
    bonusCode: { title: 'Новый бонус-код', body: '{code} {description}' },
    premiumOffer: { title: 'Скидка на отслеживаемый танк', body: '{tankName}: скидка {discountPercent}%' },
    challengeResolved: { title: 'Челлендж завершён', body: '«{title}»: {outcome}' },
    challengeOutcome: { succeeded: 'выполнен', failed: 'провален' },
    clanEventReminder: { title: '[{clanTag}] Скоро событие', body: '«{title}» начнётся {startsAt}' },
    clanWeeklyReport: {
      title: '[{clanTag}] Недельный отчёт',
      body: 'Событий: {events}, явка {attendance}%, новых кандидатов: {newCandidates}, неактивных бойцов: {inactiveMembers}'
    },
    badgeAwarded: { title: 'Новый бейдж!', body: '«{title}» получен' },
    digest: {
      title: 'Ваша неделя в Броневике',
      body: '{battles} боёв в {sessions} сессиях, {winRate}% побед, {avgDamage} среднего урона, новых отметок: {marksGained}',
      empty: 'На этой неделе боёв не было. Ждём вас в игре!'
    },
    open: 'Открыть',
    missing: '—'
  },
  en: {
    moeGained: { title: 'New mark of excellence!', body: '{nickname}: mark {marks} on {tankName}' },
    moeGainedFollowed: { title: 'A friend earned a mark', body: '{nickname} earned mark {marks} on {tankName}' },
    moeThresholdDropped: { title: 'Mark threshold dropped', body: '{tankName}: mark {mark} now needs {to} damage (was {from})' },
    sessionFinished: {
      title: 'Session summary',
      body: '{nickname}: {battles} battles, {winRate}% wins, {avgDamage} average damage, WN8 {wn8}'
    },
    bonusCode: { title: 'New bonus code', body: '{code} {description}' },
    premiumOffer: { title: 'A tracked tank is on sale', body: '{tankName}: {discountPercent}% off' },
    challengeResolved: { title: 'Challenge finished', body: '"{title}": {outcome}' },
    challengeOutcome: { succeeded: 'completed', failed: 'failed' },
    clanEventReminder: { title: '[{clanTag}] Event soon', body: '"{title}" starts {startsAt}' },
    clanWeeklyReport: {
      title: '[{clanTag}] Weekly report',
      body: 'Events: {events}, attendance {attendance}%, new candidates: {newCandidates}, inactive members: {inactiveMembers}'
    },
    badgeAwarded: { title: 'New badge!', body: '"{title}" earned' },
    digest: {
      title: 'Your week on Bronevik',
      body: '{battles} battles in {sessions} sessions, {winRate}% wins, {avgDamage} average damage, new marks: {marksGained}',
      empty: 'No battles this week. See you in the game!'
    },
    open: 'Open',
    missing: '—'
  }
} as const;
