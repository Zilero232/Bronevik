import type { TankDetailInput } from '@/entities/tank/tank';

export type TankDetailQueryInput = Omit<TankDetailInput, 'signal'>;
