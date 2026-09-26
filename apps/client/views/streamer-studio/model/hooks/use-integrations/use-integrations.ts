'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { connectIntegration, disconnectIntegration, getIntegrations } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import { useStudioMutation } from '../use-studio-mutation';

export const useIntegrations = () => useQuery({ queryKey: QUERY_KEYS.me.streamer.integrations, queryFn: getIntegrations });

export const useConnectIntegration = () => {
  const t = useTranslations('streamer.studio.toast');

  return useMutation({
    mutationFn: connectIntegration,
    onSuccess: (url) => window.location.assign(url),
    onError: () => toast.error(t('connectFailed'))
  });
};

export const useDisconnectIntegration = () =>
  useStudioMutation({ mutationFn: disconnectIntegration, queryKey: QUERY_KEYS.me.streamer.integrations, successKey: 'disconnected' });
