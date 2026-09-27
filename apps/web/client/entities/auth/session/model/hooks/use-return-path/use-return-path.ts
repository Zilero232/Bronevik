'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { ROUTE_PARAMS } from '@/shared/constants';

import { RETURN_PATH } from '../../../config';
import { safeReturnPath } from '../../../lib/return-path';

export const useReturnPath = (): string => {
  const [next] = useQueryState(ROUTE_PARAMS.next, parseAsString);

  return safeReturnPath(next) ?? RETURN_PATH.fallback;
};
