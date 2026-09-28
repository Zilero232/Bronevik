import type { UsageAudience, UsageMeterKey } from '@otmetki/schemas';

import type { UsageActor } from '../../usage.types';

export type MeterScope = {
  id: string;
  limit: number;
};

export type MeterScopesInput = {
  meter: UsageMeterKey;
  audience: UsageAudience;
  actor: UsageActor;
};

export type CountKeyInput = {
  meter: UsageMeterKey;
  period: string;
  scope: string;
};

export type SeenKeyInput = CountKeyInput & {
  subject: string;
};

export type MeterStateInput = {
  meter: UsageMeterKey;
  scopes: MeterScope[];
  counts: number[];
};
