import { z } from 'zod';

const pointSchema = z.tuple([z.number(), z.number()]);

export const arenaBoundsSchema = z.object({
  boundingBox: z.object({ bottomLeft: pointSchema, upperRight: pointSchema })
});

export const heatmapDataSchema = z.object({
  cells: z.array(z.number().nonnegative())
});
