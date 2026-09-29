import { isIncludedIn } from 'remeda';

import { api } from '@/shared/api/http';
import { fromServer } from '@/shared/api/source';

import type { Health, HealthInput } from './health.types';

import { HEALTH_REQUEST } from '../../config';
import { healthSchema } from './health.schemas';

export const getHealth = ({ signal }: HealthInput = {}): Promise<Health> =>
  fromServer(async () =>
    healthSchema.parse(
      (await api.get(HEALTH_REQUEST.path, { signal, validateStatus: (status) => isIncludedIn(status, HEALTH_REQUEST.answeredStatuses) })).data
    )
  );
