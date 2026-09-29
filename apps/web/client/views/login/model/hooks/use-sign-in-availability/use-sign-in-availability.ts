'use client';

import { useLestaNotice } from '@/entities/app/lesta-notice';

import { useTelegramWidgetConfig } from '../use-telegram-widget-config';

export const useSignInAvailability = () => {
  const isLestaPending = useLestaNotice();
  const { data: telegram, isError } = useTelegramWidgetConfig();

  return { isClosed: isLestaPending && (isError || telegram?.enabled === false) };
};
