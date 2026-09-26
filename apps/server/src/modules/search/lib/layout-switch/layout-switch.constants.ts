export const KEYBOARD = {
  latin: "`qwertyuiop[]asdfghjkl;'zxcvbnm,.",
  cyrillic: 'ёйцукенгшщзхъфывапролджэячсмитьбю'
} as const;

export const TRANSLIT = {
  replacements: [
    ['ё', 'e'],
    ['Ё', 'E'],
    ['х', 'h'],
    ['Х', 'H']
  ]
} as const;

export const PATTERNS = {
  cyrillic: /\p{Script=Cyrillic}/u,
  nickname: /^\w+$/,
  likeSpecial: /[\\%_]/g
} as const;
