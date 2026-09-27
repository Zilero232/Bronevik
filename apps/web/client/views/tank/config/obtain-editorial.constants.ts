import type { VehicleSourceKind } from '@otmetki/schemas';

import type { BadgeTone } from '@/ui-kit';

export const OBTAIN_EDITORIAL = {
  dateFormat: { day: 'numeric', month: 'short', year: 'numeric' },
  kindTone: {
    personalMissions: 'steel',
    event: 'accent',
    battlePass: 'premium',
    bonds: 'warning',
    workshop: 'steel',
    shop: 'success',
    lootboxes: 'premium',
    clanWars: 'danger',
    other: 'neutral'
  } satisfies Record<VehicleSourceKind, BadgeTone>
} as const;
