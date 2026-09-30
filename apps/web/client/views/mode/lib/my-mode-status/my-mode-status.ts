import { isNotFoundError, isPlusRequiredError, isUnauthorizedError } from '@/shared/api/source';

import type { MyModeStatus, MyModeStatusInput, ShouldRetryMyModeInput } from './my-mode-status.types';

import { MY_MODE } from '../../config';

export const myModeStatus = ({ isSignedIn, isSessionPending, isPending, error, line }: MyModeStatusInput): MyModeStatus => {
  if (isSessionPending) {
    return 'session';
  }

  if (!isSignedIn || isUnauthorizedError(error)) {
    return 'signedOut';
  }

  if (isNotFoundError(error)) {
    return 'noAccount';
  }

  if (error) {
    return 'error';
  }

  if (isPending) {
    return 'pending';
  }

  return line && line.battles > 0 ? 'ready' : 'empty';
};

export const shouldRetryMyMode = ({ failureCount, error }: ShouldRetryMyModeInput): boolean =>
  !isPlusRequiredError(error) && !isNotFoundError(error) && !isUnauthorizedError(error) && failureCount < MY_MODE.retryAttempts;
