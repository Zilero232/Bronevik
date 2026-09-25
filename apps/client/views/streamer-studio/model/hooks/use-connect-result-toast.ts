'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { parseAsString, useQueryStates } from 'nuqs';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants';

import { STUDIO_CALLBACK, STUDIO_QUERY, STUDIO_TAB_PARSER } from '../../config';

export const useConnectResultToast = () => {
  const t = useTranslations('streamer.studio.toast');
  const queryClient = useQueryClient();
  const [{ connected, streamer }, setParams] = useQueryStates(
    { [STUDIO_QUERY.connected]: parseAsString, [STUDIO_QUERY.streamer]: parseAsString, [STUDIO_QUERY.tab]: STUDIO_TAB_PARSER },
    { history: 'replace', scroll: false }
  );

  useEffect(() => {
    if (connected === null && streamer === null) {
      return;
    }

    if (connected !== null || streamer === STUDIO_CALLBACK.connected) {
      toast.success(t('connected'), { id: STUDIO_CALLBACK.toastId });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.streamer.integrations });
    } else {
      toast.error(t('connectFailed'), { id: STUDIO_CALLBACK.toastId });
    }

    void setParams({ connected: null, streamer: null, tab: 'integrations' });
    // eslint-disable-next-line react/exhaustive-deps -- only a fresh OAuth callback should fire it; t, queryClient and setParams are stable
  }, [connected, streamer]);
};
