'use client';

import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import type { RatingPalette } from '../../config';

import { RATING_PALETTES } from '../../config';
import { useRatingPalette } from '../../model/hooks';

import s from './RatingPaletteToggle.module.scss';

export const RatingPaletteToggle = () => {
  const t = useTranslations('settings');
  const { palette, setPalette } = useRatingPalette();

  return (
    <div className={s.root}>
      <span className={s.label}>{t('palette')}</span>
      <SegmentedControl<RatingPalette>
        aria-label={t('palette')}
        options={RATING_PALETTES.map((value) => ({ value, label: t(`paletteOptions.${value}`) }))}
        size='sm'
        value={palette}
        onChange={setPalette}
      />
      <span className={s.hint}>{t('paletteHint')}</span>
    </div>
  );
};
