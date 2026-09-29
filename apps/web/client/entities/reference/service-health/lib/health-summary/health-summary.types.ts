import type { Health, HealthDetails } from '@otmetki/schemas';

import type { ServiceStatusValue } from '@/ui-kit';

import type { HEALTH_COMPONENTS } from '../../config';

type HealthComponent = (typeof HEALTH_COMPONENTS)[number];

export type HealthVerdict = 'degraded' | 'down' | 'noLestaKey' | 'ok' | 'unknown' | 'unreachable';

export type HealthNote = 'closed' | 'down' | 'halfOpen' | 'noLestaKey' | 'notConfigured' | 'open' | 'running' | 'stale' | 'unknown' | 'up';

export type HealthComponentView = {
  key: HealthComponent;
  status: ServiceStatusValue;
  note: HealthNote;
  checkedAt: string | null;
};

export type HealthSummary = {
  verdict: HealthVerdict;
  status: ServiceStatusValue;
  components: HealthComponentView[];
};

export type SummarizeHealthInput = {
  health: Health | undefined;
  isError: boolean;
};

export type HealthNoteInput = {
  key: HealthComponent;
  details: HealthDetails | undefined;
};
