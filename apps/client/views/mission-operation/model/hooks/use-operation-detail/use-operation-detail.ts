'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { operationQueries } from '../../../api';

export const useOperationDetail = () => {
  const params = useParams<Record<'campaign' | 'operation', string>>();

  return useQuery(operationQueries.detail({ campaign: Number(params.campaign), operation: Number(params.operation) }));
};
