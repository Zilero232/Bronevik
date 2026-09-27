import type { z } from 'zod';

import type {
  bindCodeInputSchema,
  bindCodeSchema,
  modBattleLoadoutSchema,
  modDeviceSchema,
  modDevicesSchema,
  modErrorCodeSchema,
  modOverallRatingsSchema,
  modOverviewSchema,
  modRatingsRequestSchema,
  modSessionRatingsSchema,
  modTankRatingSchema,
  modTankRatingsRequestSchema,
  modTankRatingsSchema
} from './mod.schemas';

export type BindCodeInput = z.infer<typeof bindCodeInputSchema>;
export type BindCode = z.infer<typeof bindCodeSchema>;
export type ModDevice = z.infer<typeof modDeviceSchema>;
export type ModDevices = z.infer<typeof modDevicesSchema>;
export type ModBattleLoadout = z.infer<typeof modBattleLoadoutSchema>;
export type ModErrorCode = z.infer<typeof modErrorCodeSchema>;
export type ModRatingsRequest = z.infer<typeof modRatingsRequestSchema>;
export type ModTankRatingsRequest = z.infer<typeof modTankRatingsRequestSchema>;
export type ModOverallRatings = z.infer<typeof modOverallRatingsSchema>;
export type ModSessionRatings = z.infer<typeof modSessionRatingsSchema>;
export type ModOverview = z.infer<typeof modOverviewSchema>;
export type ModTankRating = z.infer<typeof modTankRatingSchema>;
export type ModTankRatings = z.infer<typeof modTankRatingsSchema>;
