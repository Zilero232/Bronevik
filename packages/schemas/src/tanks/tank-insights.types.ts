import type { z } from 'zod';

import type {
  accountEconomyQuerySchema,
  accountEconomySchema,
  accountEconomySplitSchema,
  accountEconomyTankSchema,
  economyAccountSchema,
  learningBucketSchema,
  learningDifficultySchema,
  myTankLearningSchema,
  tankEconomyFiguresSchema,
  tankEconomyPageSchema,
  tankEconomyQuerySchema,
  tankEconomyRowSchema,
  tankEconomySchema,
  tankEconomySortFieldSchema,
  tankLearningSchema,
  tankMentionSchema,
  tankObtainSchema,
  tankOfferSchema,
  tankResearchStepSchema,
  tankRoleSchema,
  tankSourceSchema,
  tankStatusSchema,
  tankTraitsFilterSchema,
  tankTraitsSchema
} from './tank-insights.schemas';

export type TankStatus = z.infer<typeof tankStatusSchema>;
export type TankRole = z.infer<typeof tankRoleSchema>;
export type TankSource = z.infer<typeof tankSourceSchema>;
export type TankTraits = z.infer<typeof tankTraitsSchema>;
export type TankTraitsFilter = z.infer<typeof tankTraitsFilterSchema>;
export type TankOffer = z.infer<typeof tankOfferSchema>;
export type TankMention = z.infer<typeof tankMentionSchema>;
export type TankResearchStep = z.infer<typeof tankResearchStepSchema>;
export type TankObtain = z.infer<typeof tankObtainSchema>;
export type EconomyAccount = z.infer<typeof economyAccountSchema>;
export type TankEconomyFigures = z.infer<typeof tankEconomyFiguresSchema>;
export type TankEconomy = z.infer<typeof tankEconomySchema>;
export type TankEconomySortField = z.infer<typeof tankEconomySortFieldSchema>;
export type TankEconomyQuery = z.infer<typeof tankEconomyQuerySchema>;
export type TankEconomyRow = z.infer<typeof tankEconomyRowSchema>;
export type TankEconomyPage = z.infer<typeof tankEconomyPageSchema>;
export type AccountEconomyQuery = z.infer<typeof accountEconomyQuerySchema>;
export type AccountEconomySplit = z.infer<typeof accountEconomySplitSchema>;
export type AccountEconomyTank = z.infer<typeof accountEconomyTankSchema>;
export type AccountEconomy = z.infer<typeof accountEconomySchema>;
export type LearningDifficulty = z.infer<typeof learningDifficultySchema>;
export type LearningBucket = z.infer<typeof learningBucketSchema>;
export type TankLearning = z.infer<typeof tankLearningSchema>;
export type MyTankLearning = z.infer<typeof myTankLearningSchema>;
