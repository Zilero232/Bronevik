import type { RecentPeriods } from '@otmetki/schemas';

export const hasRecentHistory = (recent: RecentPeriods): boolean => recent.some(({ stats }) => stats !== null && stats.battles > 0);
