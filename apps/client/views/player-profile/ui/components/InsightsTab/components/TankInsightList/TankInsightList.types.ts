import type { TankInsight } from '@/shared/api/players';

export type TankInsightListProps = {
  kind: 'strong' | 'weak';
  tanks: TankInsight[];
};
