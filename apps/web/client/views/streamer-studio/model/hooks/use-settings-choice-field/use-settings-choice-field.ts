'use client';

import { useTranslations } from 'next-intl';

import type { SettingsChoiceFieldInput } from './use-settings-choice-field.types';

import { SETTINGS_FORM } from '../../../config';
import { useSettingsField } from '../use-settings-field';

export const useSettingsChoiceField = (field: SettingsChoiceFieldInput) => {
  const t = useTranslations('streamerSettings');
  const tf = useTranslations('streamer.settings');
  const { control, label } = useSettingsField(field.path);

  const options = field.kind === 'boolean' ? SETTINGS_FORM.booleans : field.options;

  return {
    control,
    label,
    items: [{ value: SETTINGS_FORM.unset, label: tf('unset') }, ...options.map((option) => ({ value: option, label: t(`options.${option}`) }))]
  };
};
