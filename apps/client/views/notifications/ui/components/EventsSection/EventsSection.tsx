'use client';

import type { NotificationEvent } from '@bronevik/schemas';

import { notificationEventSchema } from '@bronevik/schemas';
import { ListChecks } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { entries } from 'remeda';

import { INBOX_EVENT } from '@/entities/notification/inbox';
import { ToggleChips } from '@/ui-kit';

import type { SettingsSectionProps } from '../../../model/notifications.types';

import { EVENT_GROUPS } from '../../../config';
import { SettingsCard } from '../SettingsCard';

import s from './EventsSection.module.scss';

export const EventsSection = ({ settings, onPatch }: SettingsSectionProps) => {
  const t = useTranslations('notifications');

  const onGroupChange = (group: readonly NotificationEvent[]) => (next: NotificationEvent[]) => {
    const inGroup = new Set<NotificationEvent>(group);

    onPatch({ events: [...settings.events.filter((event) => !inGroup.has(event)), ...next] });
  };

  return (
    <SettingsCard
      description={t('settings.eventsHint')}
      eyebrow={t('settings.eventsEyebrow', { count: settings.events.length, total: notificationEventSchema.options.length })}
      icon={<ListChecks size={18} />}
      title={t('settings.events')}
    >
      <div className={s.groups}>
        {entries(EVENT_GROUPS).map(([group, events]) => (
          <div key={group} className={s.group}>
            <span className={s.label}>{t(`eventGroups.${group}`)}</span>
            <ToggleChips<NotificationEvent>
              options={events.map((event) => {
                const { icon: Icon, tone } = INBOX_EVENT[event];

                return { value: event, label: t(`events.${event}`), icon: <Icon className={s.icon} data-tone={tone} size={14} /> };
              })}
              aria-label={t(`eventGroups.${group}`)}
              size='sm'
              value={settings.events.filter((event) => new Set<NotificationEvent>(events).has(event))}
              onChange={onGroupChange(events)}
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};
