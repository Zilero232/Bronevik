'use client';

import type { NotificationEvent } from '@otmetki/schemas';

import { notificationEventSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { entries } from 'remeda';

import { INBOX_EVENT } from '@/entities/notification/inbox';
import { groupValue, mergeGroup } from '@/features/notifications/notification-settings';

import type { SettingsSectionProps } from '../../notifications.types';

import { EVENT_GROUPS } from '../../../config';

export const useEventsSection = ({ settings, onPatch }: SettingsSectionProps) => {
  const t = useTranslations('notifications');

  return {
    count: settings.events.length,
    total: notificationEventSchema.options.length,
    groups: entries(EVENT_GROUPS).map(([group, events]) => ({
      group,
      label: t(`eventGroups.${group}`),
      options: events.map((event) => ({ value: event, label: t(`events.${event}`), ...INBOX_EVENT[event] })),
      value: groupValue({ events: settings.events, group: events }),
      onChange: (next: NotificationEvent[]) => onPatch({ events: mergeGroup({ events: settings.events, group: events, next }) })
    }))
  };
};
