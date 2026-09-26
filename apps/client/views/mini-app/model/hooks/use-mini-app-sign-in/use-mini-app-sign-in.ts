'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { signInWithMiniApp } from '@/shared/api/telegram';
import { QUERY_KEYS } from '@/shared/constants';

import type { TelegramLaunch } from '../../../lib/mini-app-mode';

export const useMiniAppSignIn = ({ env, initData }: TelegramLaunch) => {
  const queryClient = useQueryClient();
  const signIn = useMutation({
    mutationFn: signInWithMiniApp,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.me.all });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session });
    }
  });

  const startedRef = useRef(false);

  useEffect(() => {
    if (env !== 'telegram' || startedRef.current) {
      return;
    }

    startedRef.current = true;
    signIn.mutate(initData ?? '');
    // eslint-disable-next-line react/exhaustive-deps -- sign in once per launch; the mutation object is rebuilt every render
  }, [env, initData]);

  return signIn;
};
