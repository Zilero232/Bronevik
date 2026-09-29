'use client';

import type { FocusEvent, KeyboardEvent, PointerEvent } from 'react';

import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

import { useHydrated } from '@/shared/lib';

import type { UsePromoCarouselInput } from './use-promo-carousel.types';

import { PROMO_CAROUSEL } from '../../../config';

export const usePromoCarousel = ({ count, delay, effect }: UsePromoCarouselInput) => {
  const isHydrated = useHydrated();
  const prefersReduced = useReducedMotion();
  const canRotate = count > 1;
  const [viewportRef, api] = useEmblaCarousel({ loop: canRotate, watchDrag: canRotate, duration: PROMO_CAROUSEL.duration }, [
    Autoplay({ delay, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false }),
    ...(effect === 'fade' ? [Fade()] : [])
  ]);

  const [selected, setSelected] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isReduced = isHydrated && prefersReduced === true;
  const hasAutoplay = canRotate && !isReduced;
  const isPlaying = hasAutoplay && !isPaused && !isHovered;

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => setSelected(api.selectedScrollSnap());

    api.on('select', onSelect).on('reInit', onSelect);

    return () => {
      api.off('select', onSelect).off('reInit', onSelect);
    };
  }, [api]);

  useEffect(() => {
    const autoplay = api?.plugins().autoplay;

    if (!api || !autoplay) {
      return;
    }

    const apply = () => (isPlaying ? autoplay.play() : autoplay.stop());

    apply();
    api.on('pointerUp', apply);

    return () => {
      api.off('pointerUp', apply);
    };
  }, [api, isPlaying]);

  const restartTimer = () => api?.plugins().autoplay?.reset();

  const goTo = (index: number) => {
    api?.scrollTo(index, isReduced);
    restartTimer();
  };

  const prev = () => {
    api?.scrollPrev(isReduced);
    restartTimer();
  };

  const next = () => {
    api?.scrollNext(isReduced);
    restartTimer();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  };

  const onPointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') {
      setIsHovered(true);
    }
  };

  const onFocus = (event: FocusEvent<HTMLElement>) => {
    const isEntering = !event.currentTarget.contains(event.relatedTarget);

    if (isEntering && event.target.matches(':focus-visible')) {
      setIsPaused(true);
    }
  };

  return {
    viewportRef,
    selected,
    canRotate,
    hasAutoplay,
    isPlaying,
    isPaused,
    goTo,
    prev,
    next,
    togglePause: () => setIsPaused((value) => !value),
    rootProps: { onKeyDown, onFocus, onPointerEnter, onPointerLeave: () => setIsHovered(false) }
  };
};
