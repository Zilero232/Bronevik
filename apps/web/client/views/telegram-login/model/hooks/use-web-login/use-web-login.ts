'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';

import { useAuthSession, useResetUserQueries, useReturnPath } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { redeemTelegramWebLogin } from '../../../api';
import { WEB_LOGIN, WEB_LOGIN_PHASE_TONE } from '../../../config';
import { webLoginCodeState, webLoginPhase } from '../../../lib/web-login';

export const useWebLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetUserQueries = useResetUserQueries();
  const returnPath = useReturnPath();
  const session = useAuthSession();
  const [code] = useQueryState(WEB_LOGIN.param, parseAsString);
  const redeem = useMutation({
    mutationFn: redeemTelegramWebLogin,
    onSuccess: async () => {
      resetUserQueries();
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session });
      router.replace(returnPath);
    }
  });

  const codeState = webLoginCodeState(code);
  const phase = webLoginPhase({ codeState, status: redeem.status });

  const confirm = () => {
    if (code === null || codeState !== 'valid' || !redeem.isIdle) {
      return;
    }

    redeem.mutate({ code });
  };

  const signedInAs = session.data?.user.name ?? null;

  return { phase, tone: WEB_LOGIN_PHASE_TONE[phase], replacedAccount: phase === 'confirm' ? signedInAs : null, confirm };
};
