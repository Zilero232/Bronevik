'use client';

import { get, useFormContext, useFormState } from 'react-hook-form';

import type { SettingsFormValues } from '../../../lib/settings-form';

export const useSettingsField = (path: string) => {
  const { control, register } = useFormContext<SettingsFormValues>();
  const { errors } = useFormState({ control, name: path });

  return { control, register, isInvalid: Boolean(get(errors, path)) };
};
