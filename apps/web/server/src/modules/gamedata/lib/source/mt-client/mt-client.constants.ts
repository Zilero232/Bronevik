export const MT_CLIENT = {
  product: 'Мир танков',
  publisher: 'Lesta',
  guids: { release: 'MT.RU.PRODUCTION', test: 'MT.PT.PRODUCTION' },
  version: /^1\.(\d+)\.\d+\.\d+$/,
  foreignGuid: /\b(WOT\.[A-Z]+\.PRODUCTION)\b/,
  readme: 'README.md',
  comparedVersionParts: 2
} as const;
