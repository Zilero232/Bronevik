import type { TankInsight } from '@/entities/player/profile';

export type TankInsightListProps = {
  kind: 'strong' | 'weak';
  tanks: TankInsight[];
};
