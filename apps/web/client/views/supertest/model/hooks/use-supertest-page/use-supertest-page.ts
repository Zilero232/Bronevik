'use client';

import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';

import { supertestControllerListOptions } from '@/shared/api/query-options';

import type { SupertestScope } from '../../supertest.types';

import { SUPERTEST, SUPERTEST_PARAMS } from '../../../config';

export const useSupertestPage = () => {
  const [{ scope }, setParams] = useQueryStates(SUPERTEST_PARAMS, { history: 'replace' });
  const { data } = useQuery({ ...supertestControllerListOptions(), staleTime: SUPERTEST.staleMs });

  return {
    scope,
    totals: data && data.totals.tanks > 0 ? data.totals : null,
    onScopeChange: (next: SupertestScope) => void setParams({ scope: next })
  };
};
