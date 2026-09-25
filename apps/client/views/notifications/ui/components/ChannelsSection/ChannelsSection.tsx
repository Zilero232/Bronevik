'use client';

import { RadioReceiver } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Switch } from '@/ui-kit';

import type { SettingsSectionProps } from '../../../model/notifications.types';

import { NOTIFICATION_CHANNELS } from '../../../config';
import { toggleValue } from '../../../lib/toggle-value';
import { SettingsCard } from '../SettingsCard';

import s from './ChannelsSection.module.scss';

export const ChannelsSection = ({ settings, onPatch }: SettingsSectionProps) => {
  const t = useTranslations('notifications.settings');

  return (
    <SettingsCard description={t('channelsHint')} eyebrow={t('channelsEyebrow')} icon={<RadioReceiver size={18} />} title={t('channels')}>
      <div className={s.list}>
        {NOTIFICATION_CHANNELS.map(({ channel, icon: Icon }) => (
          <Switch
            key={channel}
            label={
              <span className={s.label}>
                <Icon aria-hidden size={15} />
                {t(`channel.${channel}`)}
              </span>
            }
            checked={settings.channels.includes(channel)}
            description={t(`channelHint.${channel}`)}
            onCheckedChange={(isOn) => onPatch({ channels: toggleValue({ values: settings.channels, value: channel, isOn }) })}
          />
        ))}
      </div>
    </SettingsCard>
  );
};
