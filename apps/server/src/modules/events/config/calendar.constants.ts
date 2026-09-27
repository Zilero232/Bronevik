import type { GameEventKind } from '../../../../generated';

export const EVENT_KIND_RULES = [
  { kind: 'drops', pattern: /twitch|vk ?видео|vk video|дроп|drops/i },
  { kind: 'battlePass', pattern: /боев\p{L}* пропуск|battle pass/iu },
  { kind: 'frontLine', pattern: /лини\p{L} фронта|front ?line/iu },
  { kind: 'onslaught', pattern: /натиск|onslaught/i },
  { kind: 'ranked', pattern: /ранговы|ranked/i },
  { kind: 'personalMissions', pattern: /лбз|личные боевые задачи/i },
  { kind: 'marathon', pattern: /марафон/i },
  { kind: 'sale', pattern: /распродаж|скидк|чёрная пятница|черная пятница/i }
] as const satisfies readonly { kind: GameEventKind; pattern: RegExp }[];

export const EVENT_CALENDAR = {
  maxDetailPages: 8,
  defaultKind: 'event',
  newsLookbackDays: 30,
  defaultWindowDays: 60,
  dropsSlugPrefix: 'drops-news-'
} as const;
