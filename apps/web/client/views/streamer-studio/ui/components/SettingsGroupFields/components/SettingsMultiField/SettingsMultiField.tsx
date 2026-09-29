'use client';

import { Controller } from 'react-hook-form';

import { FormField, ToggleChips } from '@/ui-kit';

import type { SettingsMultiFieldProps } from './SettingsMultiField.types';

import { useSettingsMultiField } from '../../../../../model/hooks';

export const SettingsMultiField = ({ field }: SettingsMultiFieldProps) => {
  const { control, label, options } = useSettingsMultiField(field);

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
