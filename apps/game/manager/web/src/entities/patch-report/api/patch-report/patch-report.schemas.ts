import { z } from 'zod';

import { managerErrorCodeSchema } from '@/shared/api';
import { localizedSchema } from '@/shared/lib';

export const patchStatusSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('idle') }),
  z.object({ kind: z.literal('no_client') }),
  z.object({ kind: z.literal('not_installed'), gameVersion: z.string() }),
  z.object({ kind: z.literal('up_to_date'), gameVersion: z.string(), modpackVersion: z.string().nullable() }),
  z.object({
    kind: z.literal('update_available'),
    gameVersion: z.string(),
    current: z.string().nullable(),
    latest: z.string(),
    notes: localizedSchema.nullable()
  }),
  z.object({ kind: z.literal('migrated'), from: z.string(), to: z.string(), modpackVersion: z.string().nullable() }),
  z.object({ kind: z.literal('updated'), gameVersion: z.string(), from: z.string().nullable(), to: z.string() }),
  z.object({ kind: z.literal('migration_ready'), gameVersion: z.string(), from: z.string(), modpackVersion: z.string().nullable() }),
  z.object({
    kind: z.literal('update_ready'),
    gameVersion: z.string(),
    from: z.string(),
    current: z.string().nullable(),
    latest: z.string(),
    notes: localizedSchema.nullable()
  }),
  z.object({ kind: z.literal('deferred'), gameVersion: z.string(), from: z.string() }),
  z.object({ kind: z.literal('unsupported'), gameVersion: z.string() }),
  z.object({ kind: z.literal('waiting'), gameVersion: z.string(), from: z.string() }),
  z.object({ kind: z.literal('offline'), gameVersion: z.string() }),
  z.object({ kind: z.literal('failed'), code: managerErrorCodeSchema.catch('unknown') })
]);

export const patchReportSchema = z.object({
  status: patchStatusSchema,
  clientPath: z.string().nullable(),
  checkedAt: z.string().nullable()
});
