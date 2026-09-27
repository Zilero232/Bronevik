'use client';

import { useQuery } from '@tanstack/react-query';

import { getPaymentHistory } from '@/entities/plus/subscription';
import { QUERY_KEYS } from '@/shared/constants';

import { usePaymentHistoryColumns } from '../use-payment-history-columns';

export const usePaymentHistory = () => {
  const query = useQuery({ queryKey: QUERY_KEYS.me.billing.history, queryFn: getPaymentHistory });
  const columns = usePaymentHistoryColumns();

  return { query, columns };
};
