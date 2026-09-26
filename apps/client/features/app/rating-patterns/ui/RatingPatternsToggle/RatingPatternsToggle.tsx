'use client';

import { useTranslations } from 'next-intl';

import { Switch } from '@/ui-kit';

import { useRatingPatterns } from '../../model/hooks';

export const RatingPatternsToggle = () => {
  const t = useTranslations('settings');
  const { isEnabled, setEnabled } = useRatingPatterns();

  return <Switch checked={isEnabled} description={t('patternsHint')} label={t('patterns')} onCheckedChange={setEnabled} />;
};
