'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { NumberField } from '@/ui-kit';

import type { SettingsNumberFieldProps } from './SettingsNumberField.types';

import { useSettingsField } from '../../../../../model/hooks';

import s from './SettingsNumberField.module.scss';

export const SettingsNumberField = ({ field }: SettingsNumberFieldProps) => {
  const tf = useTranslations('streamer.settings');
  const { control, isInvalid, label } = useSettingsField(field.path);

  return (
    <Controller
      render={({ field: input }) => (
        <NumberField
          hint={
            <span className={s.hint} data-invalid={isInvalid || undefined}>
              {tf('range', { min: field.min, max: field.max })}
            </span>
          }
          label={label}
          max={field.max}
          min={field.min}
          step={field.step}
          value={typeof input.value === 'number' ? input.value : null}
          onValueChange={input.onChange}
        />
      )}
      control={control}
      name={field.path}
    />
  );
};
