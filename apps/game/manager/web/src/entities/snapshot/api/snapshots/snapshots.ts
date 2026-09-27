import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { SnapshotTarget } from './snapshots.types';

import { snapshotsSchema } from './snapshots.schemas';

export const listSnapshots = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.listSnapshots, schema: snapshotsSchema, args: { clientPath } });

export const createSnapshot = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.createSnapshot, schema: snapshotsSchema, args: { clientPath } });

export const restoreSnapshot = ({ clientPath, id }: SnapshotTarget) =>
  invokeCommand({ command: COMMANDS.restoreSnapshot, schema: snapshotsSchema, args: { clientPath, id } });

export const deleteSnapshot = ({ clientPath, id }: SnapshotTarget) =>
  invokeCommand({ command: COMMANDS.deleteSnapshot, schema: snapshotsSchema, args: { clientPath, id } });
