'use client';

import { toast } from 'sonner';

import { toggleEvent, useNotificationSettings } from '@/features/notifications/notification-settings';

import type { UseEventAlertInput } from './use-event-alert.types';

export const useEventAlert = ({ event, messages }: UseEventAlertInput) => {
  const { settings, isSignedIn, isPending, onPatch } = useNotificationSettings({
    onSuccess: (next) => toast.success(next.events.includes(event) ? messages.enabled : messages.disabled),
    onError: () => toast.error(messages.failed)
  });

  return {
    isSignedIn,
    isOn: settings?.events.includes(event) ?? false,
    isPending,
    onToggle: (isOn: boolean) => settings && onPatch({ events: toggleEvent({ events: settings.events, event, isOn }) })
  };
};
