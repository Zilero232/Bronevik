'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { FormField, Input } from '@/ui-kit';

import type { SettingsTextFieldProps } from './SettingsTextField.types';

import { fieldLabelKey } from '../../../../../lib/settings-form';
import { useSettingsField } from '../../../../../model/hooks';

export const SettingsTextField = ({ field }: SettingsTextFieldProps) => {
  const t = useTranslations('streamerSettings');
  const tf = useTranslations('streamer.settings');
  const id = useId();
  const { register, isInvalid } = useSettingsField(field.path);

  return (
    <FormField error={isInvalid && tf('errors.invalid')} htmlFor={id} label={t(fieldLabelKey(field.path))}>
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
