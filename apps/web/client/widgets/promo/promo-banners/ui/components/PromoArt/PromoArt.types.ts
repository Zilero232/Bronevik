import type { PromoArt, PromoTone } from '../../../lib/resolve-promos';

export type PromoArtProps = {
  art: PromoArt;
  tone: PromoTone;
  variant: 'hero' | 'tile';
  isPriority?: boolean;
};
