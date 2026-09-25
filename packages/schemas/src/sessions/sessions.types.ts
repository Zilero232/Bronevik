import type { z } from 'zod';

import type {
  battleResultSchema,
  sessionBattleSchema,
  sessionKindSchema,
  sessionListItemSchema,
  sessionSchema,
  sessionSourceSchema,
  sessionsPageSchema,
  sessionTankDeltaSchema,
  shotSchema
} from './sessions.schemas';

export type SessionKind = z.infer<typeof sessionKindSchema>;
export type SessionSource = z.infer<typeof sessionSourceSchema>;
export type BattleResult = z.infer<typeof battleResultSchema>;
export type Shot = z.infer<typeof shotSchema>;
export type SessionBattle = z.infer<typeof sessionBattleSchema>;
export type SessionTankDelta = z.infer<typeof sessionTankDeltaSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type SessionListItem = z.infer<typeof sessionListItemSchema>;
export type SessionsPage = z.infer<typeof sessionsPageSchema>;
