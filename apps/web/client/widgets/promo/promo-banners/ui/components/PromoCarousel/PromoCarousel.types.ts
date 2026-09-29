import type { PromoId } from '../../../config';
import type { ResolvedPromo } from '../../../lib/resolve-promos';
import type { PromoArtProps } from '../PromoArt';

export type PromoCarouselVariant = PromoArtProps['variant'];

export type PromoCarouselProps = {
  items: readonly ResolvedPromo<PromoId>[];
  variant: PromoCarouselVariant;
  label: string;
  delay: number;
  hasCta?: boolean;
  className?: string;
};
