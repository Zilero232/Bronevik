import type { PlayerProfile } from '@otmetki/schemas';

import type { FavoriteKinds } from '../../../../../lib/favorite-kinds';

export type HeaderIdentityProps = {
  summary: PlayerProfile['summary'];
  badge: string | null;
  kinds: FavoriteKinds;
  isKindsLoading?: boolean;
  isKindsFailed?: boolean;
};
