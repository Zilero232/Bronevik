'use client';

import { useQuery } from '@tanstack/react-query';

import { getTelegramStatus } from '@/shared/api/telegram';
import { QUERY_KEYS } from '@/shared/constants';

import { TELEGRAM_LINK } from '../../config';

export const useTelegramStatus = (isPolling: boolean) =>
  useQuery({
    queryKey: QUERY_KEYS.me.telegram,
    queryFn: getTelegramStatus,
    refetchInterval: isPolling ? TELEGRAM_LINK.pollMs : false
  });
