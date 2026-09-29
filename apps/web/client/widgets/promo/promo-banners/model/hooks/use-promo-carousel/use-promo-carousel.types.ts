export type PromoCarouselEffect = 'fade' | 'slide';

export type UsePromoCarouselInput = {
  count: number;
  delay: number;
  effect: PromoCarouselEffect;
};
