import type { GroupInsight } from '@/shared/api/players';

export type GroupBreakdownProps = {
  kind: 'class' | 'tier';
  groups: GroupInsight[];
};
