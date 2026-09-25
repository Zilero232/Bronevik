'use client';

import { useQuery } from '@tanstack/react-query';

import { getPaymentHistory } from '@/shared/api/billing';
import { QUERY_KEYS } from '@/shared/constants';

export const usePaymentHistory = () => useQuery({ queryKey: QUERY_KEYS.me.billing.history, queryFn: getPaymentHistory });
