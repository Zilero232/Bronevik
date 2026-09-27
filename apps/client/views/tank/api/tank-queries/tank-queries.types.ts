import type { TankDetailInput } from '@/entities/tank/tank';

export type TankDetailParams = Omit<TankDetailInput, 'signal'>;
