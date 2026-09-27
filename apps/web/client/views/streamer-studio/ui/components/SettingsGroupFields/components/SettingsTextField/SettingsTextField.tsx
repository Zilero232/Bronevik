'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { FormField, Input } from '@/ui-kit';

import type { SettingsTextFieldProps } from './SettingsTextField.types';

import { useSettingsField } from '../../../../../model/hooks';

export const SettingsTextField = ({ field }: SettingsTextFieldProps) => {
  const tf = useTranslations('streamer.settings');
  const id = useId();
  const { register, isInvalid, label } = useSettingsField(field.path);

  return (
    <FormField error={isInvalid && tf('errors.invalid')} htmlFor={id} label={label}>
      <Input
        id={id}
        isInvalid={isInvalid}
        placeholder={'placeholder' in field ? field.placeholder : undefined}
        size='sm'
        spellCheck={false}
        {...register(field.path)}
      />
    </FormField>
  );
};
