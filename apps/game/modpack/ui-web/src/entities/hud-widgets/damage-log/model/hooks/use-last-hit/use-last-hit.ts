import type { LastHitData } from '../../schemas';

import { formatNumber } from '../../../../../../shared/lib/hud-format';
import { useFlash } from '../../../../../../shared/lib/use-flash';

export const useLastHit = (data: LastHitData) => {
  const flash = useFlash(`${data.name}:${data.amount}`);

  return { flash, amount: formatNumber(-data.amount) };
};
