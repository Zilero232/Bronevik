import type { SnapshotMode } from './snapshots.types';

export const SNAPSHOT_MODES = ['all', 'random'] as const satisfies readonly SnapshotMode[];
