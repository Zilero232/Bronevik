'use client';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { isIncludedIn } from 'remeda';

import { FormField, ToggleChips } from '@/ui-kit';

import type { SettingsMultiFieldProps } from './SettingsMultiField.types';

import { fieldLabelKey } from '../../../../../lib/settings-form';
import { useSettingsField } from '../../../../../model/hooks';

export const SettingsMultiField = ({ field }: SettingsMultiFieldProps) => {
  const t = useTranslations('streamerSettings');
  const { control } = useSettingsField(field.path);

  const label = t(fieldLabelKey(field.path));
  const options = field.options.map((option) => ({
    value: option,
    label: isIncludedIn(option, STREAMER_SETTINGS.zoomSteps) ? option : t(`options.${option}`)
  }));

  return (
    <FormField label={label}>
      <Controller
        render={({ field: input }) => (
          <ToggleChips<string>
            aria-label={label}
            options={options}
            size='sm'
            value={Array.isArray(input.value) ? input.value : []}
            onChange={input.onChange}
          />
        )}
        control={control}
        name={field.path}
      />
    </FormField>
  );
};
