import { useTranslations } from 'next-intl';

import { RatingPaletteToggle } from '@/features/app/rating-palette';
import { RatingPatternsToggle } from '@/features/app/rating-patterns';
import { RATING_TONES, toneThresholds } from '@/shared/lib';
import { ProgressBar, RatingBadge } from '@/ui-kit';

import { COLOR_SWATCHES, SPACING_STEPS } from '../../../config';
import { DesignBlock, DesignRow } from '../DesignBlock';

import s from './ColorsSection.module.scss';

const WN8_THRESHOLDS = toneThresholds('wn8');

export const ColorsSection = () => {
  const t = useTranslations('design.colors');
  const tRating = useTranslations('rating');

  return (
    <DesignBlock eyebrow='01' id='colors' title={t('title')}>
      {COLOR_SWATCHES.map((group) => (
        <DesignRow key={group.group} label={t(group.group)}>
          {group.tokens.map((token) => (
            <span key={token} className={s.swatch}>
              <span className={s.chip} style={{ background: `var(${token})` }} />
              <code className={s.token}>{token.replace('--color-', '')}</code>
            </span>
          ))}
        </DesignRow>
      ))}
      <DesignRow label={t('rating')}>
        {RATING_TONES.map((tone) => (
          <RatingBadge key={tone} label={tRating(tone)} tone={tone} value={`${WN8_THRESHOLDS[tone] ?? 0}+`} />
        ))}
      </DesignRow>
      <DesignRow className={s.stack} label={t('patterns')}>
        <RatingPatternsToggle />
        <RatingPaletteToggle />
        {RATING_TONES.map((tone, index) => (
          <ProgressBar key={tone} className={s.bar} max={RATING_TONES.length} size='sm' tone={tone} value={index + 1} />
        ))}
      </DesignRow>
      <DesignRow label={t('spacing')}>
        {SPACING_STEPS.map((step) => (
          <span key={step} className={s.space} style={{ width: `var(--space-${step})` }} title={`--space-${step}`} />
        ))}
      </DesignRow>
    </DesignBlock>
  );
};
