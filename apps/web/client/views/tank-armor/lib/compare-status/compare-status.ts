import { isNotFoundError, isPlusRequiredError } from '@/shared/api/source';

import type { ArmorCompareStatus, CompareStatusInput } from './compare-status.types';

export const compareStatus = ({ hasData, error }: CompareStatusInput): ArmorCompareStatus => {
  if (hasData) {
    return 'ready';
  }

  if (!error) {
    return 'loading';
  }

  if (isPlusRequiredError(error)) {
    return 'limited';
  }

  return isNotFoundError(error) ? 'missing' : 'error';
};
