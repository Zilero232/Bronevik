import type { TankDetail } from '@otmetki/schemas';

import type { TankIdentityData } from '@/entities/tank/tank';

export type TankContextValue = {
  detail: TankDetail;
  identity: TankIdentityData;
  tankId: number;
  slug: string;
};
