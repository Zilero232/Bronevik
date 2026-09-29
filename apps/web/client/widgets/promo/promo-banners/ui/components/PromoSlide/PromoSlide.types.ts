import type { PromoId } from '../../../config';
import type { ResolvedPromo } from '../../../lib/resolve-promos';

export type PromoSlideProps = {
  promo: ResolvedPromo<PromoId>;
  hasCta: boolean;
  isPriority: boolean;
};
