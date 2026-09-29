import * as z from 'zod/mini';

import { hudIconSchema } from '../../../../../shared/api/hud-protocol';
import { TEAM_HP } from '../../config';

const side = z.object({ hp: z.number(), max: z.number(), alive: z.number(), count: z.number(), frags: z.number() });

const vehicle = z.object({ icon: hudIconSchema, hp: z.number(), max: z.number(), alive: z.boolean() });

export const teamHpSchema = z.object({
  style: z.enum(TEAM_HP.styles),
  allies: side,
  enemies: side,
  show_score: z.boolean(),
  diff: z.nullable(z.number()),
  colors: z.object({ ally: z.string(), enemy: z.string() }),
  vehicles: z.object({ allies: z.array(vehicle), enemies: z.array(vehicle) })
});
