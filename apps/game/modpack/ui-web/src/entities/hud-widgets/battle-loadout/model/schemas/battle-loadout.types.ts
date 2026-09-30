import type * as z from 'zod/mini';

import type { battleLoadoutSchema, equipmentItemSchema, setBadgeSchema } from './battle-loadout.schemas';

export type BattleLoadoutData = z.infer<typeof battleLoadoutSchema>;

export type EquipmentItem = z.infer<typeof equipmentItemSchema>;

export type SetBadge = z.infer<typeof setBadgeSchema>;
