'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { Select } from '@/ui-kit';

import type { SettingsChoiceFieldProps } from './SettingsChoiceField.types';

import { SETTINGS_FORM } from '../../../../../config';
import { fieldLabelKey } from '../../../../../lib/settings-form';
import { useSettingsField } from '../../../../../model/hooks';

export const SettingsChoiceField = ({ field }: SettingsChoiceFieldProps) => {
  const t = useTranslations('streamerSettings');
  const tf = useTranslations('streamer.settings');
  const { control } = useSettingsField(field.path);

  const options = field.kind === 'boolean' ? SETTINGS_FORM.booleans : field.options;
  const items = [{ value: SETTINGS_FORM.unset, label: tf('unset') }, ...options.map((option) => ({ value: option, label: t(`options.${option}`) }))];

  return (
    <Controller
      render={({ field: input }) => (
        <Select<string>
          items={items}
          label={t(fieldLabelKey(field.path))}
          value={typeof input.value === 'string' ? input.value : SETTINGS_FORM.unset}
          onValueChange={input.onChange}
        />
      )}
      control={control}
      name={field.path}
    />
  );
};
