'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { PromoCarouselProps } from './PromoCarousel.types';

import { usePromoCarousel } from '../../../model/hooks';
import { PromoSlide } from '../PromoSlide';
import { PromoTile } from '../PromoTile';
import { CarouselControls } from './components';

import s from './PromoCarousel.module.scss';

export const PromoCarousel = ({ items, variant, label, delay, hasCta = true, className }: PromoCarouselProps) => {
  const t = useTranslations('promo.carousel');
  const { viewportRef, selected, canRotate, hasAutoplay, isPlaying, isPaused, goTo, prev, next, togglePause, rootProps } = usePromoCarousel({
    count: items.length,
    delay,
    effect: variant === 'tile' ? 'fade' : 'slide'
  });

  return (
    <div
      aria-label={label}
      aria-roledescription={t('role')}
      className={clsx(s.root, className)}
      data-theme={variant === 'hero' ? 'dark' : undefined}
      data-variant={variant}
      role='region'
      {...rootProps}
    >
      <div ref={viewportRef} className={s.viewport}>
        <div aria-live={isPlaying ? 'off' : 'polite'} className={s.track}>
          {items.map((promo, index) => (
            <div
              key={promo.id}
              aria-label={t('slide', { index: index + 1, count: items.length })}
              aria-roledescription={t('slideRole')}
              className={s.slide}
              inert={index !== selected}
              role='group'
            >
              {variant === 'tile' ? <PromoTile promo={promo} /> : <PromoSlide hasCta={hasCta} isPriority={index === 0} promo={promo} />}
            </div>
          ))}
        </div>
      </div>
      {canRotate && (
        <CarouselControls
          count={items.length}
          hasAutoplay={hasAutoplay}
          isPaused={isPaused}
          selected={selected}
          variant={variant}
          onNext={next}
          onPrev={prev}
          onSelect={goTo}
          onTogglePause={togglePause}
        />
      )}
    </div>
  );
};
