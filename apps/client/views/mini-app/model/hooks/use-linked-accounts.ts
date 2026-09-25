'use client';

import { useQuery } from '@tanstack/react-query';

import { getLinkedAccounts } from '@/shared/api/me';
import { QUERY_KEYS } from '@/shared/constants';

export const useLinkedAccounts = () => useQuery({ queryKey: QUERY_KEYS.me.section('accounts'), queryFn: getLinkedAccounts });
