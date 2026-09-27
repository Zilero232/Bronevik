'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { QUERY_KEYS } from '@/shared/constants';

import type { UseMiniAppSignInInput } from './use-mini-app-sign-in.types';

import { signInWithMiniApp, signInWithVkMiniApp } from '../../../api';

export const useMiniAppSignIn = ({ launch, platform }: UseMiniAppSignInInput) => {
  const queryClient = useQueryClient();
  const signIn = useMutation({
    mutationFn: platform === 'vk' ? signInWithVkMiniApp : signInWithMiniApp,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.me.all });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session });
    }
  });

  const startedRef = useRef(false);

  useEffect(() => {
    if (launch.env !== 'inside' || startedRef.current) {
      return;
    }

    startedRef.current = true;
    signIn.mutate(launch.payload ?? '');
    // eslint-disable-next-line react/exhaustive-deps -- sign in once per launch; the mutation object is rebuilt every render
  }, [launch.env, launch.payload]);

  return signIn;
};
