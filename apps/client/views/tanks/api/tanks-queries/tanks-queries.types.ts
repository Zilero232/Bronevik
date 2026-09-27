import type { TankEconomyTableInput, TankStatsInput, TierListInput } from '@/entities/tank/tank';

export type TankStatsQueryInput = Omit<TankStatsInput, 'signal'>;

export type TierListQueryInput = Omit<TierListInput, 'signal'>;

export type EconomyTableQueryInput = Omit<TankEconomyTableInput, 'signal'>;
