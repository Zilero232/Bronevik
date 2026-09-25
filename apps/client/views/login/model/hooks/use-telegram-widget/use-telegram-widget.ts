'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getTelegramWidget, signInWithTelegram } from '@/shared/api/auth';
import { QUERY_KEYS } from '@/shared/constants';

import type { TelegramAuthHandler, UseTelegramWidgetInput } from './use-telegram-widget.types';

import { LOGIN } from '../../../config';

export const useTelegramWidget = ({ container, onSignedIn }: UseTelegramWidgetInput) => {
  const { data: config } = useQuery({ queryKey: QUERY_KEYS.auth.telegramWidget, queryFn: getTelegramWidget, staleTime: Infinity });

  const botUsername = config?.enabled ? config.botUsername : null;

  useEffect(() => {
    const node = container.current;

    if (!node || !botUsername) {
      return;
    }

    const script = document.createElement('script');

    const onAuth: TelegramAuthHandler = (user) => {
      void signInWithTelegram(user).then(onSignedIn);
    };

    Reflect.set(window, LOGIN.telegramCallback, onAuth);

    script.src = LOGIN.telegramScript;
    script.async = true;
    script.dataset.telegramLogin = botUsername;
    script.dataset.size = 'large';
    script.dataset.radius = '6';
    script.dataset.requestAccess = 'write';
    script.dataset.onauth = `${LOGIN.telegramCallback}(user)`;
    node.append(script);

    return () => {
      node.replaceChildren();
      Reflect.deleteProperty(window, LOGIN.telegramCallback);
    };
    // eslint-disable-next-line react/exhaustive-deps -- the widget is injected once per bot; onSignedIn is rebuilt every render
  }, [botUsername]);

  return { isEnabled: Boolean(botUsername), isLoaded: config !== undefined };
};
