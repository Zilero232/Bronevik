import type { z } from 'zod';

import type { snapshotPartSchema, snapshotSchema } from './snapshots.schemas';

export type Snapshot = z.infer<typeof snapshotSchema>;

export type SnapshotPart = z.infer<typeof snapshotPartSchema>;

export type SnapshotTarget = {
  clientPath: string | null;
  id: string;
};
