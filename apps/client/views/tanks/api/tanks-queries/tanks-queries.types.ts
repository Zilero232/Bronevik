import type { TankEconomyTableInput, TankStatsInput, TierListInput } from '@/entities/tank/tank';

export type TankStatsParams = Omit<TankStatsInput, 'signal'>;

export type TierListParams = Omit<TierListInput, 'signal'>;

export type EconomyTableParams = Omit<TankEconomyTableInput, 'signal'>;
