'use client';

import { MoonStar } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Switch } from '@/ui-kit';

import type { SettingsSectionProps } from '../../../model/notifications.types';

import { QUIET_HOURS } from '../../../config';
import { QuietHoursForm } from '../QuietHoursForm';
import { SettingsCard } from '../SettingsCard';

import s from './QuietHoursSection.module.scss';

export const QuietHoursSection = ({ settings, onPatch }: SettingsSectionProps) => {
  const t = useTranslations('notifications.quiet');

  const { quietHours } = settings;

  return (
    <SettingsCard description={t('description')} eyebrow={t('eyebrow')} icon={<MoonStar size={18} />} title={t('title')}>
      <Switch
        checked={quietHours !== null}
        className={s.toggle}
        description={t('enableHint')}
        label={t('enable')}
        onCheckedChange={(isOn) => onPatch({ quietHours: isOn ? { ...QUIET_HOURS.defaults } : null })}
      />
      {quietHours && (
        <QuietHoursForm key={`${quietHours.start}-${quietHours.end}`} range={quietHours} onSave={(range) => onPatch({ quietHours: range })} />
      )}
    </SettingsCard>
  );
};
