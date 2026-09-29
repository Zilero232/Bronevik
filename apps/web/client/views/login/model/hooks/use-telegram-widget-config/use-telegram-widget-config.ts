'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getTelegramWidget } from '../../../api';

export const useTelegramWidgetConfig = () => useQuery({ queryKey: QUERY_KEYS.auth.telegramWidget, queryFn: getTelegramWidget, staleTime: Infinity });
