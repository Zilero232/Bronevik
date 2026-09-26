'use client';

import { useQuery } from '@tanstack/react-query';

import { getPaymentHistory } from '@/shared/api/billing';
import { QUERY_KEYS } from '@/shared/constants';

import { usePaymentHistoryColumns } from '../use-payment-history-columns';

export const usePaymentHistory = () => {
  const { data, isPending, isError, isFetching, refetch } = useQuery({ queryKey: QUERY_KEYS.me.billing.history, queryFn: getPaymentHistory });
  const columns = usePaymentHistoryColumns();

  return { payments: data ?? [], columns, isPending, isError, isRetrying: isFetching, retry: () => void refetch() };
};
