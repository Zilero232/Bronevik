import { tankMathControllerGet } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { TankMath, TankMathInput } from './tank-math.types';

export const getTankMath = ({ tankId, signal }: TankMathInput): Promise<TankMath> =>
  fromSdk(() => tankMathControllerGet({ path: { tankId }, signal }));
