'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { RatingPaletteToggle } from '@/features/app/rating-palette';
import { RatingPatternsToggle } from '@/features/app/rating-patterns';
import { RATING_TONES } from '@/shared/lib';
import { IconButton, Popover, RatingBadge } from '@/ui-kit';

import type { DisplaySettingsProps } from './DisplaySettings.types';

import s from './DisplaySettings.module.scss';

export const DisplaySettings = ({ className }: DisplaySettingsProps) => {
  const t = useTranslations('settings');
  const tRating = useTranslations('rating');

  return (
    <Popover
      trigger={
        <IconButton aria-label={t('title')} className={className}>
          <SlidersHorizontal size={16} />
        </IconButton>
      }
      align='end'
      description={t('description')}
      title={t('title')}
    >
      <RatingPatternsToggle />
      <RatingPaletteToggle />
      <div className={s.preview}>
        {RATING_TONES.map((tone) => (
          <RatingBadge key={tone} size='sm' tone={tone} value={tRating(tone)} withPips={false} />
        ))}
      </div>
    </Popover>
  );
};
