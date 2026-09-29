import type { PromoId } from '../../../config';
import type { ResolvedPromo } from '../../../lib/resolve-promos';

export type PromoKickerProps = {
  promo: ResolvedPromo<PromoId>;
};
