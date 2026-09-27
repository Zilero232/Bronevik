import type { z } from 'zod';

import type { tankMathSchema } from './dto';

export type TankMath = z.infer<typeof tankMathSchema>;

export type TankMathConfig = TankMath['top'];
