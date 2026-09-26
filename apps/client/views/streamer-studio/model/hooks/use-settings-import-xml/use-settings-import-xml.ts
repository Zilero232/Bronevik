'use client';

import type { ChangeEvent } from 'react';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import type { PreferencesImport } from '@/entities/streamer/preferences';

import { parsePreferences, PREFERENCES_FILE } from '@/entities/streamer/preferences';

import type { SettingsImportStatus, UseSettingsImportXmlInput } from './use-settings-import-xml.types';

export const useSettingsImportXml = ({ onImport }: UseSettingsImportXmlInput) => {
  const t = useTranslations('streamer.settings.xml');
  const [result, setResult] = useState<PreferencesImport | null>(null);
  const [status, setStatus] = useState<SettingsImportStatus>('idle');

  const read = async (file: File) => {
    if (file.size > PREFERENCES_FILE.maxBytes) {
      setResult(null);
      setStatus('invalid');

      return;
    }

    try {
      const parsed = parsePreferences(await file.text());

      setResult(parsed);
      setStatus(parsed.found.length > 0 ? 'ready' : 'empty');
    } catch {
      setResult(null);
      setStatus('invalid');
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (file) {
      void read(file);
    }
  };

  const onApply = () => {
    if (!result) {
      return;
    }

    onImport(result);
    toast.success(t('applied', { count: result.found.length }));
    setResult(null);
    setStatus('idle');
  };

  return { status, found: result?.found ?? [], onFileChange, onApply };
};
