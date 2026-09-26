import { isoDateTimeSchema, uuidSchema, visibilitySchema } from '@bronevik/schemas';
import { z } from 'zod';

import { arenaIdSchema } from '../../community-core';

const tacticLayerSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().max(64),
  visible: z.boolean().default(true),
  strokes: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        tool: z.enum(['pen', 'arrow', 'line', 'circle', 'rect', 'text']),
        color: z.string().max(32),
        width: z.number().positive().max(64),
        points: z.array(z.number()).max(4000),
        text: z.string().max(500).optional()
      })
    )
    .max(2000)
    .default([]),
  icons: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        kind: z.enum(['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG', 'flag', 'marker']),
        team: z.number().int().min(0).max(2),
        x: z.number(),
        y: z.number(),
        rotation: z.number().default(0),
        label: z.string().max(64).optional()
      })
    )
    .max(500)
    .default([])
});

export const tacticBoardDataSchema = z.object({
  layers: z.array(tacticLayerSchema).max(20).default([])
});

export const tacticBoardSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  arenaId: z.string().nullable(),
  mode: z.string().nullable(),
  visibility: visibilitySchema,
  data: tacticBoardDataSchema,
  role: z.enum(['owner', 'edit', 'view']),
  shareToken: z.string().nullable(),
  editToken: z.string().nullable(),
  updatedAt: isoDateTimeSchema
});

export const tacticBoardListSchema = z.array(tacticBoardSchema);

const tacticBoardFieldsSchema = z.object({
  title: z.string().trim().min(1).max(120),
  arenaId: arenaIdSchema.optional(),
  mode: z.string().trim().min(1).max(32).optional(),
  visibility: visibilitySchema,
  data: tacticBoardDataSchema
});

export const createTacticBoardSchema = tacticBoardFieldsSchema.extend({
  visibility: visibilitySchema.default('unlisted'),
  data: tacticBoardDataSchema.default({ layers: [] })
});

export const updateTacticBoardSchema = tacticBoardFieldsSchema.partial();

export const boardTokenQuerySchema = z.object({ token: z.string().trim().min(8).max(64).optional() });
