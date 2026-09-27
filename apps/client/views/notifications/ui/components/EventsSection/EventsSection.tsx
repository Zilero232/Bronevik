'use client';

import type { NotificationEvent } from '@otmetki/schemas';

import { ListChecks } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ToggleChips } from '@/ui-kit';

import type { SettingsSectionProps } from '../../../model/notifications.types';

import { useEventsSection } from '../../../model/hooks';
import { SettingsCard } from '../SettingsCard';

import s from './EventsSection.module.scss';

export const EventsSection = (props: SettingsSectionProps) => {
  const t = useTranslations('notifications.settings');
  const { count, total, groups } = useEventsSection(props);

  return (
    <SettingsCard description={t('eventsHint')} eyebrow={t('eventsEyebrow', { count, total })} icon={<ListChecks size={18} />} title={t('events')}>
      <div className={s.groups}>
        {groups.map(({ group, label, options, value, onChange }) => (
          <div key={group} className={s.group}>
            <span className={s.label}>{label}</span>
            <ToggleChips<NotificationEvent>
              options={options.map(({ icon: Icon, tone, ...option }) => ({
                ...option,
                icon: <Icon className={s.icon} data-tone={tone} size={14} />
              }))}
              aria-label={label}
              size='sm'
              value={value}
              onChange={onChange}
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};
