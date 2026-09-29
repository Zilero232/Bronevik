import type { PromoId } from '../../../config';
import type { ResolvedPromo } from '../../../lib/resolve-promos';

export type PromoTileProps = {
  promo: ResolvedPromo<PromoId>;
};
