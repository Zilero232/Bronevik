import { NATIONS, TANK_CLASSES, TIERS } from '@bronevik/icons';

import { seededRandom } from '@/shared/lib';
import { MOCK_TANKS } from '@/shared/mocks';

const random = seededRandom(2026);

export const TABLE_ROWS = {
  small: MOCK_TANKS,
  large: Array.from({ length: 1000 }, (_, index) => {
    const base = MOCK_TANKS[index % MOCK_TANKS.length];

    return {
      ...base,
      id: 100_000 + index,
      slug: `${base.slug}-${index}`,
      name: `${base.name} #${index + 1}`,
      nation: NATIONS[Math.floor(random() * NATIONS.length)],
      type: TANK_CLASSES[Math.floor(random() * TANK_CLASSES.length)],
      tier: TIERS[Math.floor(random() * TIERS.length)],
      winRate: Math.round((45 + random() * 12) * 100) / 100,
      avgDamage: Math.round(300 + random() * 3200),
      battles: Math.round(10_000 + random() * 2_000_000)
    };
  })
} as const;
