import type { TankCollectionCriteria } from '../lib/tank-collections/tank-collections.types';

export const TANK_COLLECTION_SLUGS = ['preferential', 'armored', 'scouts', 'premium-farm', 'collector'] as const;

export const TANK_COLLECTIONS = {
  preferential: { isPreferential: true },
  armored: { roles: ['HT_assault', 'HT_break', 'ATSPG_assault'] },
  scouts: { types: ['lightTank'] },
  'premium-farm': { statuses: ['premium'], tiers: [8] },
  collector: { statuses: ['collector'] }
} as const satisfies Record<(typeof TANK_COLLECTION_SLUGS)[number], TankCollectionCriteria>;
