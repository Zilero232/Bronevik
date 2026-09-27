import type { GroupInsight } from '@/entities/player/profile';

export type GroupBreakdownProps = {
  kind: 'class' | 'tier';
  groups: GroupInsight[];
};
