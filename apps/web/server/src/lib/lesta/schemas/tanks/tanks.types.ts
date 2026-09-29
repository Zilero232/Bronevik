import type { z } from 'zod';

import type { tankAchievementsSchema, tankGarageSchema, tankMasterySchema, tankStatsSchema } from './tanks.schemas';

export type TankStats = z.infer<typeof tankStatsSchema>;
export type TankGarage = z.infer<typeof tankGarageSchema>;
export type TankAchievements = z.infer<typeof tankAchievementsSchema>;
export type TankMastery = z.infer<typeof tankMasterySchema>;
