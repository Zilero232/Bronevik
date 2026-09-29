'use client';

import { Controller } from 'react-hook-form';

import { Select } from '@/ui-kit';

import type { SettingsChoiceFieldProps } from './SettingsChoiceField.types';

import { SETTINGS_FORM } from '../../../../../config';
import { useSettingsChoiceField } from '../../../../../model/hooks';

export const SettingsChoiceField = ({ field }: SettingsChoiceFieldProps) => {
  const { control, label, items } = useSettingsChoiceField(field);

  return (
    <Controller
      render={({ field: input }) => (
        <Select<string>
          items={items}
          label={label}
          value={typeof input.value === 'string' ? input.value : SETTINGS_FORM.unset}
          onValueChange={input.onChange}
        />
      )}
      control={control}
      name={field.path}
    />
  );
};
