import * as z from 'zod/mini';

import { PROTOCOL } from '../protocol';
import { HUD_PROTOCOL } from './hud-protocol.constants';

const alignX = z.enum(PROTOCOL.alignX);
const alignY = z.enum(PROTOCOL.alignY);

export const hudPanelSchema = z.object({
  id: z.string(),
  text: z.string(),
  x: z.number(),
  y: z.number(),
  align_x: alignX,
  align_y: alignY,
  alpha: z.number(),
  drag: z.boolean(),
  border: z.boolean(),
  visible: z.boolean()
});

export const hudStateSchema = z.object({
  v: z.literal(HUD_PROTOCOL.version),
  cursor: z.boolean(),
  panels: z.array(hudPanelSchema)
});

export const hudMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ready') }),
  z.object({ type: z.literal('moved'), id: z.string(), x: z.number(), y: z.number(), align_x: alignX, align_y: alignY })
]);
