import { match } from 'ts-pattern';

import type { StatusMessageValuesInput, StatusView, StatusViewInput } from './status-view.types';

export const statusView = ({ status, needsMigration }: StatusViewInput): StatusView =>
  match(status)
    .with({ kind: 'up_to_date' }, ({ kind }) => ({ kind, tone: 'success' as const, action: needsMigration ? ('migrate' as const) : null }))
    .with({ kind: 'migrated' }, { kind: 'updated' }, ({ kind }) => ({ kind, tone: 'success' as const, action: null }))
    .with({ kind: 'update_available' }, ({ kind }) => ({ kind, tone: 'premium' as const, action: 'update' as const }))
    .with({ kind: 'waiting' }, ({ kind }) => ({ kind, tone: 'warning' as const, action: needsMigration ? ('migrate' as const) : null }))
    .with({ kind: 'offline' }, { kind: 'failed' }, ({ kind }) => ({ kind, tone: 'danger' as const, action: null }))
    .with({ kind: 'idle' }, { kind: 'no_client' }, { kind: 'not_installed' }, ({ kind }) => ({ kind, tone: 'neutral' as const, action: null }))
    .exhaustive();

export const statusMessageValues = ({ status, modpackVersion }: StatusMessageValuesInput): Record<string, string> =>
  Object.fromEntries(
    Object.entries({ version: modpackVersion ?? '', ...status }).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );
