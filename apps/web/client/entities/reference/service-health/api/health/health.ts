import type { Health } from '@otmetki/schemas';

import { isIncludedIn } from 'remeda';

import { healthControllerCheck } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { HealthInput } from './health.types';

import { HEALTH_REQUEST } from '../../config';

export const getHealth = ({ signal }: HealthInput = {}): Promise<Health> =>
  fromSdk(() => healthControllerCheck({ signal, validateStatus: (status) => isIncludedIn(status, HEALTH_REQUEST.answeredStatuses) }));
