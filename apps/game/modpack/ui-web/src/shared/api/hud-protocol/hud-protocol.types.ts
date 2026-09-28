import type * as z from 'zod/mini';

import type { hudMessageSchema, hudPanelSchema, hudStateSchema } from './hud-protocol.schemas';

export type HudState = z.infer<typeof hudStateSchema>;
export type HudPanel = z.infer<typeof hudPanelSchema>;
export type HudMessage = z.infer<typeof hudMessageSchema>;
export type HudMessageOf<Type extends HudMessage['type']> = Extract<HudMessage, { type: Type }>;
