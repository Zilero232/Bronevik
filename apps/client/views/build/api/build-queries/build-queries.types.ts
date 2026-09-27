import type { RecommendedBuildInput } from '@/entities/tank/build';
import type { TankDetailInput } from '@/entities/tank/tank';

export type RecommendedBuildParams = Omit<RecommendedBuildInput, 'signal'>;

export type TankDetailParams = Omit<TankDetailInput, 'signal'>;
