import type { RecommendedBuildInput } from '@/entities/tank/build';
import type { TankDetailInput } from '@/entities/tank/tank';

export type RecommendedBuildQueryInput = Omit<RecommendedBuildInput, 'signal'>;

export type TankDetailQueryInput = Omit<TankDetailInput, 'signal'>;
