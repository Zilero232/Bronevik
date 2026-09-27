'use client';

import type { NotificationSettings } from '@otmetki/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';

import type { UseNotificationSettingsInput } from './use-notification-settings.types';

import { getNotificationSettings, updateNotificationSettings } from '../../../api';
import { NOTIFICATION_SETTINGS } from '../../../config';

const { queryKey, mutationKey } = NOTIFICATION_SETTINGS;

export const useNotificationSettings = ({ onSuccess, onError }: UseNotificationSettingsInput = {}) => {
  const queryClient = useQueryClient();
  const session = useAuthSession();
  const isSignedIn = Boolean(session.data);
  const query = useQuery({ queryKey, queryFn: getNotificationSettings, enabled: isSignedIn });
  const save = useMutation({
    mutationKey,
    mutationFn: updateNotificationSettings,
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<NotificationSettings>(queryKey, (current) => current && { ...current, ...patch });
    },
    onSuccess,
    onError,
    onSettled: () => (queryClient.isMutating({ mutationKey }) === 1 ? queryClient.invalidateQueries({ queryKey }) : undefined)
  });

  return {
    query,
    settings: query.data,
    isSignedIn,
    isPending: session.isPending || (isSignedIn && query.isPending),
    onPatch: (patch: Partial<NotificationSettings>) => save.mutate(patch)
  };
};
