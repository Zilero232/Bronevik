'use client';

import type { SettingsValues, StreamerSettingsView } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { toSettingsValues } from '@otmetki/schemas';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { PreferencesImport } from '@/entities/streamer/preferences';

import { SETTINGS_FIELDS } from '@/entities/streamer/settings';

import type { SettingsFormValues } from '../../../lib/settings-form';
import type { SettingsSaveSource } from './use-streamer-settings-form.types';

import { mergeSettings, readPath, settingsFormSchema, toFormLeaf, toSettingsFormValues } from '../../../lib/settings-form';
import { useSaveStreamerSettings } from '../use-streamer-settings';

export const useStreamerSettingsForm = (view: StreamerSettingsView) => {
  const save = useSaveStreamerSettings();
  const [source, setSource] = useState<SettingsSaveSource>('creator');
  const form = useForm<SettingsFormValues, unknown, SettingsValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: toSettingsFormValues(toSettingsValues(view.settings))
  });

  const onSubmit = form.handleSubmit((edited) => save.mutate({ source, values: mergeSettings({ base: toSettingsValues(view.settings), edited }) }));

  const onImport = ({ values, found }: PreferencesImport) => {
    for (const field of SETTINGS_FIELDS) {
      if (found.includes(field.path)) {
        form.setValue(field.path, toFormLeaf({ field, value: readPath(values, field.path) }), { shouldDirty: true });
      }
    }

    setSource('preferences');
  };

  return {
    form,
    isPending: save.isPending,
    isDirty: form.formState.isDirty,
    isImported: source === 'preferences',
    onSubmit,
    onImport
  };
};
