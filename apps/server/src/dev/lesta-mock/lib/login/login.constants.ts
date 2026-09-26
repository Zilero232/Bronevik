export const LOGIN = {
  path: 'auth/login/',
  title: 'Вход — мок Lesta ID',
  note: 'Только для разработки: ключ Lesta API не задан, поэтому вход выполняется от имени игрока из сгенерированного мира.',
  searchPlaceholder: 'Никнейм (от 3 символов)',
  searchButton: 'Найти',
  cancel: 'Отменить вход',
  invalidRequest: 'Invalid Lesta mock login request',
  unknownAccount: 'Unknown mock account',
  minQuery: 3,
  searchLimit: 40,
  top: 8,
  average: 6,
  weak: 3,
  fresh: 3,
  tokenTtlSec: 14 * 86_400
} as const;
