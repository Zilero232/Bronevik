import type { TankStatsInput } from '@/entities/tank/tank';

export type TankStatsParams = Omit<TankStatsInput, 'signal'>;
