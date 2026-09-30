import type { SyncReport } from '@/entities/site-sync';

import { SITE_SYNC } from '@/entities/site-sync';

import type { SyncConflict } from './sync-conflicts.types';

import { SYNC_NOW } from '../../config';

export const syncConflicts = (report: SyncReport): SyncConflict[] =>
  SITE_SYNC.libraries.flatMap((library) => {
    const result = report[library];

    return result?.outcome === 'conflict' ? [{ library, localChanges: result.localChanges, remoteChanges: result.remoteChanges }] : [];
  });

const changingOutcomes = new Set<string>(SYNC_NOW.changingOutcomes);

export const syncBroughtChanges = (report: SyncReport): boolean =>
  SITE_SYNC.libraries.some((library) => {
    const outcome = report[library]?.outcome;

    return outcome !== undefined && changingOutcomes.has(outcome);
  });
