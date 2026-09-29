import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { CarouselControlsProps } from './CarouselControls.types';

import { PROMO_ICON } from '../../../../../config';

import s from './CarouselControls.module.scss';

export const CarouselControls = ({
  count,
  selected,
  variant,
  hasAutoplay,
  isPaused,
  onSelect,
  onPrev,
  onNext,
  onTogglePause
}: CarouselControlsProps) => {
  const t = useTranslations('promo.carousel');

  return (
    <div className={s.root} data-variant={variant}>
      <div className={s.dots}>
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            aria-current={index === selected || undefined}
            aria-label={t('goTo', { index: index + 1, count })}
            className={s.dot}
            type='button'
            onClick={() => onSelect(index)}
          >
            <span aria-hidden className={s.pip} />
          </button>
        ))}
      </div>
      <div className={s.buttons}>
        {hasAutoplay && (
          <button aria-label={isPaused ? t('play') : t('pause')} className={s.button} type='button' onClick={onTogglePause}>
            {isPaused ? <Play aria-hidden size={PROMO_ICON.control} /> : <Pause aria-hidden size={PROMO_ICON.control} />}
          </button>
        )}
        {variant === 'hero' && (
          <>
            <button aria-label={t('prev')} className={s.button} type='button' onClick={onPrev}>
              <ChevronLeft aria-hidden size={PROMO_ICON.control} />
            </button>
            <button aria-label={t('next')} className={s.button} type='button' onClick={onNext}>
              <ChevronRight aria-hidden size={PROMO_ICON.control} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
