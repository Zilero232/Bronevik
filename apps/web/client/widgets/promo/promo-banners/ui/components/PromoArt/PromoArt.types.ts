import type { PromoArt, PromoTone } from '../../../lib/resolve-promos';

export type PromoArtVariant = 'hero' | 'tile';

export type PromoArtProps = {
  art: PromoArt;
  tone: PromoTone;
  variant: PromoArtVariant;
  isPriority?: boolean;
};
