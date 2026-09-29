import { AxiosError, isAxiosError } from 'axios';
import { isIncludedIn } from 'remeda';

import { httpStatusOf } from '@/shared/api/source';

import type { RetryDecisionInput } from './retry-policy.types';

import { QUERY_RETRY } from './retry-policy.constants';

const attemptsFor = (error: unknown): number => {
  const status = httpStatusOf(error);

  if (status !== null) {
    return isIncludedIn(status, QUERY_RETRY.gatewayStatuses) ? QUERY_RETRY.gatewayAttempts : 0;
  }

  return isAxiosError(error) && error.code === AxiosError.ERR_NETWORK ? QUERY_RETRY.networkAttempts : 0;
};

export const shouldRetryQuery = ({ failureCount, error }: RetryDecisionInput): boolean => failureCount < attemptsFor(error);
