import type { HealthSummary } from '@/entities/reference/service-health';

export type StatusVerdictProps = Pick<HealthSummary, 'status' | 'verdict'> & {
  checkedAt: number | null;
  isFetching: boolean;
  onRefresh: () => void;
};
