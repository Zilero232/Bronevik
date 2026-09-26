import type { z } from 'zod';

import type {
  bonusCodeReportSchema,
  bonusCodeSchema,
  bonusCodeStatusSchema,
  bonusCodeVerdictSchema,
  gameEventKindSchema,
  gameEventSchema,
  gameEventsQuerySchema,
  newsItemSchema,
  newsKindSchema,
  newsPageSchema,
  newsQuerySchema,
  premiumOfferSchema
} from './shop.schemas';

export type BonusCodeStatus = z.infer<typeof bonusCodeStatusSchema>;
export type BonusCodeVerdict = z.infer<typeof bonusCodeVerdictSchema>;
export type BonusCode = z.infer<typeof bonusCodeSchema>;
export type BonusCodeReportInput = z.infer<typeof bonusCodeReportSchema>;
export type PremiumOffer = z.infer<typeof premiumOfferSchema>;
export type GameEventKind = z.infer<typeof gameEventKindSchema>;
export type GameEvent = z.infer<typeof gameEventSchema>;
export type GameEventsQuery = z.infer<typeof gameEventsQuerySchema>;
export type NewsKind = z.infer<typeof newsKindSchema>;
export type NewsQuery = z.input<typeof newsQuerySchema>;
export type NewsItem = z.infer<typeof newsItemSchema>;
export type NewsPage = z.infer<typeof newsPageSchema>;
