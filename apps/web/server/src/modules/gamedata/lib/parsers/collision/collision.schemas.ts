import { z } from 'zod';

const vec3Schema = z.tuple([z.number(), z.number(), z.number()]);

const count = z.number().int().nonnegative();

const collisionPartSchema = z
  .object({
    positions: z.array(z.number()).refine((positions) => positions.length % 3 === 0, 'positions must be xyz triples'),
    indices: z.array(count).refine((indices) => indices.length % 3 === 0, 'indices must form triangles'),
    groups: z.array(z.object({ name: z.string().min(1), start: count, count }))
  })
  .superRefine(({ positions, indices, groups }, context) => {
    const vertexCount = positions.length / 3;

    if (indices.some((index) => index >= vertexCount)) {
      context.addIssue({ code: 'custom', message: 'an index points past the vertex list' });
    }

    if (groups.some(({ start, count: size }) => start + size > indices.length || start % 3 !== 0 || size % 3 !== 0)) {
      context.addIssue({ code: 'custom', message: 'a group does not cover whole triangles of the index list' });
    }
  });

export const collisionSchema = z.object({
  parts: z.record(z.string(), collisionPartSchema),
  armor: z.record(z.string(), z.record(z.string(), z.number())).default({}),
  spaced: z.record(z.string(), z.array(z.string())).default({}),
  hullPosition: vec3Schema.nullish(),
  modules: z.record(z.string(), z.string()).default({}),
  mounts: z
    .object({
      turret: vec3Schema.nullish(),
      guns: z.record(z.string(), vec3Schema).default({}),
      pitch: z.record(z.string(), z.tuple([z.number(), z.number()])).default({})
    })
    .default({ guns: {}, pitch: {} })
});

export const modelIndexSchema = z.record(z.string(), z.string().regex(/^[\w-]+\/[\w.-]+$/));
