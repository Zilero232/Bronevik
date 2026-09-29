import type { PromoId } from '../../../config';
import type { ResolvedPromo } from '../../../lib/resolve-promos';

export type PromoCarouselVariant = 'hero' | 'tile';

export type PromoCarouselProps = {
  items: readonly ResolvedPromo<PromoId>[];
  variant: PromoCarouselVariant;
  label: string;
  delay: number;
  hasCta?: boolean;
  className?: string;
};
