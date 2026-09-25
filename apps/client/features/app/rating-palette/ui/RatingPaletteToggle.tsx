'use client';

import { useTranslations } from 'next-intl';

import { Switch } from '@/ui-kit';

import { useRatingPalette } from '../model/hooks';

export const RatingPaletteToggle = () => {
  const t = useTranslations('settings');
  const { isXvm, setPalette } = useRatingPalette();

  return (
    <Switch checked={isXvm} description={t('xvmHint')} label={t('xvm')} onCheckedChange={(checked) => setPalette(checked ? 'xvm' : 'default')} />
  );
};
