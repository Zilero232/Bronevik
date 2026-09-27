'use client';

import { FileBarChart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Switch } from '@/ui-kit';

import type { SettingsSectionProps } from '../../../model/notifications.types';

import { SettingsCard } from '../SettingsCard';

import s from './ReportsSection.module.scss';

export const ReportsSection = ({ settings, onPatch }: SettingsSectionProps) => {
  const t = useTranslations('notifications.settings');

  return (
    <SettingsCard eyebrow={t('reportsEyebrow')} icon={<FileBarChart size={18} />} title={t('reports')}>
      <div className={s.list}>
        <Switch
          checked={settings.sessionReport}
          description={t('sessionReportHint')}
          label={t('sessionReport')}
          onCheckedChange={(sessionReport) => onPatch({ sessionReport })}
        />
        <Switch
          checked={settings.weeklyDigest}
          description={t('weeklyDigestHint')}
          label={t('weeklyDigest')}
          onCheckedChange={(weeklyDigest) => onPatch({ weeklyDigest })}
        />
      </div>
    </SettingsCard>
  );
};
