export const CLAN_EMBLEM = {
  size: { xs: 24, sm: 32, md: 64, lg: 96, xl: 195 },
  fallbackLetters: 2
} as const;

export type ClanEmblemSize = keyof typeof CLAN_EMBLEM.size;
