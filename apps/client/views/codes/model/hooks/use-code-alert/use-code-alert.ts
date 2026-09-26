'use client';

import type { NotificationSettings } from '@otmetki/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { getNotificationSettings, updateNotificationSettings } from '@/features/notifications/notification-settings';
import { QUERY_KEYS } from '@/shared/constants';

import { CODE_ALERT } from '../../../config';
import { toggleEvent } from '../../../lib/event-toggle';

const SETTINGS_KEY = QUERY_KEYS.me.section('notifications');

export const useCodeAlert = () => {
  const t = useTranslations('codes.alert');
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const { data: settings, isPending: isSettingsPending } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: getNotificationSettings,
    enabled: Boolean(session)
  });

  const save = useMutation({
    mutationFn: (events: NotificationSettings['events']) => updateNotificationSettings({ events }),
    onMutate: async (events) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_KEY });

      const previous = queryClient.getQueryData<NotificationSettings>(SETTINGS_KEY);

      queryClient.setQueryData<NotificationSettings>(SETTINGS_KEY, (current) => current && { ...current, events });

      return { previous };
    },
    onSuccess: (next) => {
      queryClient.setQueryData(SETTINGS_KEY, next);
      toast.success(next.events.includes(CODE_ALERT.event) ? t('enabled') : t('disabled'));
    },
    onError: (_error, _events, context) => {
      queryClient.setQueryData(SETTINGS_KEY, context?.previous);
      toast.error(t('failed'));
    }
  });

  const isSignedIn = Boolean(session);
  const isOn = settings?.events.includes(CODE_ALERT.event) ?? false;

  const onToggle = (next: boolean) => {
    if (!settings) {
      return;
    }

    save.mutate(toggleEvent({ events: settings.events, event: CODE_ALERT.event, isOn: next }));
  };

  return {
    isSignedIn,
    isOn,
    isPending: isSessionPending || (isSignedIn && isSettingsPending),
    onToggle
  };
};
