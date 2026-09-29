'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import type { TelegramAuthHandler } from './use-telegram-widget.types';

import { signInWithTelegram } from '../../../api';
import { LOGIN } from '../../../config';
import { useCompleteSignIn } from '../use-complete-sign-in';
import { useTelegramWidgetConfig } from '../use-telegram-widget-config';

export const useTelegramWidget = () => {
  const t = useTranslations('auth');
  const completeSignIn = useCompleteSignIn();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: config, isError } = useTelegramWidgetConfig();
  const { mutate: signIn, isPending: isSigningIn } = useMutation({
    mutationFn: signInWithTelegram,
    onSuccess: completeSignIn,
    onError: () => toast.error(t('telegramFailed'))
  });

  const botUsername = config?.enabled ? config.botUsername : null;

  useEffect(() => {
    const node = containerRef.current;

    if (!node || !botUsername) {
      return;
    }

    const script = document.createElement('script');

    const onAuth: TelegramAuthHandler = (user) => {
      signIn(user);
    };

    Reflect.set(window, LOGIN.telegramCallback, onAuth);

    script.src = LOGIN.telegramScript;
    script.async = true;
    script.dataset.telegramLogin = botUsername;
    script.dataset.size = LOGIN.telegramWidget.size;
    script.dataset.radius = LOGIN.telegramWidget.radius;
    script.dataset.requestAccess = LOGIN.telegramWidget.requestAccess;
    script.dataset.onauth = `${LOGIN.telegramCallback}(user)`;
    node.append(script);

    return () => {
      node.replaceChildren();
      Reflect.deleteProperty(window, LOGIN.telegramCallback);
    };
  }, [botUsername, signIn]);

  return { containerRef, isEnabled: Boolean(botUsername), isLoaded: config !== undefined || isError, isSigningIn };
};
