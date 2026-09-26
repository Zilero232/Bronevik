'use client';

import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Badge, Input } from '@/ui-kit';

import type { ChannelsFieldsProps } from './ChannelsFields.types';

import { useChannelsFields } from '../../../model/hooks';
import { FormField } from '../FormField';

import s from './ChannelsFields.module.scss';

export const ChannelsFields = ({ channels }: ChannelsFieldsProps) => {
  const t = useTranslations('streamer.profile');
  const id = useId();
  const { rows } = useChannelsFields(channels);

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t('channels')}</legend>
      <p className={s.hint}>{t('channelsHint')}</p>
      {rows.map(({ platform, field, error, isVerified }) => (
        <FormField
          key={platform}
          label={
            <span className={s.label}>
              {t(`platform.${platform}`)}
              {isVerified && (
                <Badge shape='pill' tone='success'>
                  <BadgeCheck size={12} />
                  {t('verified')}
                </Badge>
              )}
            </span>
          }
          error={error && t(`errors.${error}`, { platform: t(`platform.${platform}`) })}
          htmlFor={`${id}-${platform}`}
        >
          <Input
            id={`${id}-${platform}`}
            inputMode='url'
            isInvalid={Boolean(error)}
            placeholder={t(`channelPlaceholder.${platform}`)}
            size='sm'
            spellCheck={false}
            type='url'
            {...field}
          />
        </FormField>
      ))}
    </fieldset>
  );
};
