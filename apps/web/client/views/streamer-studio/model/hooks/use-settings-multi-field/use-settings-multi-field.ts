'use client';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { isIncludedIn } from 'remeda';

import type { SettingsMultiFieldInput } from './use-settings-multi-field.types';

import { useSettingsField } from '../use-settings-field';

export const useSettingsMultiField = (field: SettingsMultiFieldInput) => {
  const t = useTranslations('streamerSettings');
  const { control, label } = useSettingsField(field.path);

  return {
    control,
    label,
    options: field.options.map((option) => ({
      value: option,
      label: isIncludedIn(option, STREAMER_SETTINGS.zoomSteps) ? option : t(`options.${option}`)
    }))
  };
};
