export const SITE = {
  url: 'https://bronevik.su',
  name: 'Броневик',
  title: 'Броневик',
  description: 'Статистика «Мира танков»: игроки, танки, отметки, топы, кланы и инструменты в одном месте.',
  locale: 'ru_RU',
  lang: 'ru-RU',
  copyrightYear: 2026,
  themeColor: {
    light: '#e4e5dd',
    dark: '#121410'
  },
  en: {
    title: 'Bronevik',
    description: '«Мир танков» stats: players, tanks, marks of excellence, leaderboards, clans and tools in one place.',
    locale: 'en_US',
    lang: 'en-US'
  }
} as const;

export const EXTERNAL_LINKS = {
  game: 'https://tanki.su',
  lestaSupport: 'https://lesta.ru/support/ru/'
} as const;

export const TELEGRAM_BOT = {
  username: 'BronevikBot',
  url: 'https://t.me/BronevikBot'
} as const;
