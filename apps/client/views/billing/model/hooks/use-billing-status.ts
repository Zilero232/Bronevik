'use client';

import { useQuery } from '@tanstack/react-query';

import { getBillingStatus } from '@/shared/api/billing';
import { QUERY_KEYS } from '@/shared/constants';

export const useBillingStatus = () => useQuery({ queryKey: QUERY_KEYS.me.billing.status, queryFn: getBillingStatus });
