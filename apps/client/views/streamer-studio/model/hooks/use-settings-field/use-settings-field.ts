'use client';

import { get, useFormContext, useFormState } from 'react-hook-form';

import { useSettingsFormatter } from '@/entities/streamer/settings';

import type { SettingsFormValues } from '../../../lib/settings-form';

export const useSettingsField = (path: string) => {
  const { control, register } = useFormContext<SettingsFormValues>();
  const { errors } = useFormState({ control, name: path });
  const { fieldLabel } = useSettingsFormatter();

  return { control, register, isInvalid: Boolean(get(errors, path)), label: fieldLabel(path) };
};
