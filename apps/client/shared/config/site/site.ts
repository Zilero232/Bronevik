export const SITE = {
  url: 'https://otmetki.su',
  name: 'Три отметки',
  title: 'Три отметки',
  description: 'Статистика «Мира танков»: игроки, танки, отметки, топы, кланы и инструменты в одном месте.',
  locale: 'ru_RU',
  lang: 'ru-RU',
  copyrightYear: 2026,
  themeColor: {
    light: '#e4e5dd',
    dark: '#121410'
  },
  en: {
    title: 'Three Marks',
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
  username: 'OtmetkiBot',
  url: 'https://t.me/OtmetkiBot'
} as const;
