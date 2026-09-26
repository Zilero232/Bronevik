'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { QUERY_KEYS } from '@/shared/constants';

import type { TelegramAuthHandler } from './use-telegram-widget.types';

import { getTelegramWidget, signInWithTelegram } from '../../../api';
import { LOGIN } from '../../../config';
import { useCompleteSignIn } from '../use-complete-sign-in';

export const useTelegramWidget = () => {
  const completeSignIn = useCompleteSignIn();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: config, isError } = useQuery({ queryKey: QUERY_KEYS.auth.telegramWidget, queryFn: getTelegramWidget, staleTime: Infinity });

  const botUsername = config?.enabled ? config.botUsername : null;

  useEffect(() => {
    const node = containerRef.current;

    if (!node || !botUsername) {
      return;
    }

    const script = document.createElement('script');

    const onAuth: TelegramAuthHandler = (user) => {
      void signInWithTelegram(user).then(completeSignIn);
    };

    Reflect.set(window, LOGIN.telegramCallback, onAuth);

    script.src = LOGIN.telegramScript;
    script.async = true;
    script.dataset.telegramLogin = botUsername;
    script.dataset.size = 'large';
    script.dataset.radius = '2';
    script.dataset.requestAccess = 'write';
    script.dataset.onauth = `${LOGIN.telegramCallback}(user)`;
    node.append(script);

    return () => {
      node.replaceChildren();
      Reflect.deleteProperty(window, LOGIN.telegramCallback);
    };
    // eslint-disable-next-line react/exhaustive-deps -- the widget is injected once per bot; completeSignIn is rebuilt every render
  }, [botUsername]);

  return { containerRef, isEnabled: Boolean(botUsername), isLoaded: config !== undefined || isError };
};
