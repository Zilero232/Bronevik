import type { PromoCarouselVariant } from '../../PromoCarousel.types';

export type CarouselControlsProps = {
  count: number;
  selected: number;
  variant: PromoCarouselVariant;
  hasAutoplay: boolean;
  isPaused: boolean;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
};
