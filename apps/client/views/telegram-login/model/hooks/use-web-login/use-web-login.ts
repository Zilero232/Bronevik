'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useRef } from 'react';

import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { redeemTelegramWebLogin } from '../../../api';
import { WEB_LOGIN, WEB_LOGIN_PHASE_TONE } from '../../../config';
import { webLoginCodeState, webLoginPhase } from '../../../lib/web-login';

export const useWebLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [code] = useQueryState(WEB_LOGIN.param, parseAsString);
  const redeem = useMutation({
    mutationFn: redeemTelegramWebLogin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session });
      router.replace(ROUTES.account.overview);
    }
  });

  const requestedRef = useRef<string | null>(null);

  const codeState = webLoginCodeState(code);

  useEffect(() => {
    if (code === null || codeState !== 'valid' || requestedRef.current === code) {
      return;
    }

    requestedRef.current = code;
    redeem.mutate({ code });
    // eslint-disable-next-line react/exhaustive-deps -- redeem each code once; the mutation object is rebuilt every render
  }, [code, codeState]);

  const phase = webLoginPhase({ codeState, status: redeem.status });

  return { phase, tone: WEB_LOGIN_PHASE_TONE[phase] };
};
