import type { HealthDetails } from '@otmetki/schemas';

import { match, P } from 'ts-pattern';

import type { ServiceStatusValue } from '@/ui-kit';

import type { HealthComponentView, HealthNote, HealthNoteInput, HealthSummary, HealthVerdict, SummarizeHealthInput } from './health-summary.types';

import { HEALTH_COMPONENTS, HEALTH_STATES, HEALTH_VERDICT_STATUS } from '../../config';

const indicatorStatus = (indicator: HealthDetails[keyof HealthDetails]): ServiceStatusValue =>
  match(indicator?.status)
    .with('up', () => 'ok' as const)
    .with('degraded', () => 'degraded' as const)
    .with('down', () => 'down' as const)
    .otherwise(() => 'unknown' as const);

const healthNote = ({ key, details }: HealthNoteInput): HealthNote =>
  match(key)
    .with(P.union('database', 'redis'), (connection) =>
      match(details?.[connection]?.status)
        .with(undefined, () => 'unknown' as const)
        .with('down', () => 'down' as const)
        .otherwise(() => 'up' as const)
    )
    .with('worker', () =>
      match(details?.worker)
        .with(undefined, () => 'unknown' as const)
        .with({ mode: HEALTH_STATES.noLestaKey }, () => 'noLestaKey' as const)
        .with({ state: HEALTH_STATES.stale }, () => 'stale' as const)
        .with({ status: 'up' }, () => 'running' as const)
        .otherwise(() => 'unknown' as const)
    )
    .with('lestaCircuit', () =>
      match(details?.lestaCircuit?.state)
        .with(HEALTH_STATES.closed, () => 'closed' as const)
        .with(HEALTH_STATES.open, () => 'open' as const)
        .with(HEALTH_STATES.halfOpen, () => 'halfOpen' as const)
        .with(HEALTH_STATES.notConfigured, () => 'notConfigured' as const)
        .otherwise(() => 'unknown' as const)
    )
    .exhaustive();

export const summarizeHealth = ({ health, isError }: SummarizeHealthInput): HealthSummary => {
  const details = health?.details;

  const components: HealthComponentView[] = HEALTH_COMPONENTS.map((key) => ({
    key,
    status: indicatorStatus(details?.[key]),
    note: healthNote({ key, details }),
    checkedAt: key === 'worker' ? (details?.worker?.collectedAt ?? null) : null
  }));

  const verdict: HealthVerdict = match({ health, isError })
    .with({ health: undefined, isError: true }, () => 'unreachable' as const)
    .with({ health: undefined }, () => 'unknown' as const)
    .with({ health: { status: P.union('error', 'shutting_down') } }, () => 'down' as const)
    .when(
      () => components.some(({ status }) => status === 'down'),
      () => 'down' as const
    )
    .when(
      () => components.some(({ note }) => note === 'noLestaKey'),
      () => 'noLestaKey' as const
    )
    .with({ health: { status: 'degraded' } }, () => 'degraded' as const)
    .otherwise(() => 'ok' as const);

  return { verdict, status: HEALTH_VERDICT_STATUS[verdict], components };
};
