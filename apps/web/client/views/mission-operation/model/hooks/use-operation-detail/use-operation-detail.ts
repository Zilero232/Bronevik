'use client';

import { useQuery } from '@tanstack/react-query';

import { useRouteParam } from '@/shared/lib';

import { operationQueries } from '../../../api';

export const useOperationDetail = () => {
  const campaign = useRouteParam('campaign');
  const operation = useRouteParam('operation');

  return useQuery(operationQueries.detail({ campaign: Number(campaign), operation: Number(operation) }));
};
