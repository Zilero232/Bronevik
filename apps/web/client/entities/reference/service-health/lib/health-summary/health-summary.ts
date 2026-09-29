import { match, P } from 'ts-pattern';

import type { ServiceStatusValue } from '@/ui-kit';

import type { HealthIndicator } from '../../api/health';
import type { HealthComponentView, HealthNote, HealthNoteInput, HealthSummary, HealthVerdict, SummarizeHealthInput } from './health-summary.types';

import { HEALTH_COMPONENTS, HEALTH_STATES, HEALTH_VERDICT_STATUS } from '../../config';

const indicatorStatus = (indicator: HealthIndicator | undefined): ServiceStatusValue =>
  match(indicator?.status)
    .with('up', () => 'ok' as const)
    .with('degraded', () => 'degraded' as const)
    .with('down', () => 'down' as const)
    .otherwise(() => 'unknown' as const);

const healthNote = ({ key, indicator }: HealthNoteInput): HealthNote => {
  if (!indicator) {
    return 'unknown';
  }

  return match(key)
    .with(P.union('database', 'redis'), () => (indicator.status === 'down' ? ('down' as const) : ('up' as const)))
    .with('worker', () =>
      match(indicator)
        .with({ mode: HEALTH_STATES.noLestaKey }, () => 'noLestaKey' as const)
        .with({ state: HEALTH_STATES.stale }, () => 'stale' as const)
        .with({ status: 'up' }, () => 'running' as const)
        .otherwise(() => 'unknown' as const)
    )
    .with('lestaCircuit', () =>
      match(indicator.state)
        .with(HEALTH_STATES.closed, () => 'closed' as const)
        .with(HEALTH_STATES.open, () => 'open' as const)
        .with(HEALTH_STATES.halfOpen, () => 'halfOpen' as const)
        .with(HEALTH_STATES.notConfigured, () => 'notConfigured' as const)
        .otherwise(() => 'unknown' as const)
    )
    .exhaustive();
};

export const summarizeHealth = ({ health, isError }: SummarizeHealthInput): HealthSummary => {
  const components: HealthComponentView[] = HEALTH_COMPONENTS.map((key) => {
    const indicator = health?.details[key];

    return { key, status: indicatorStatus(indicator), note: healthNote({ key, indicator }), checkedAt: indicator?.collectedAt ?? null };
  });

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
