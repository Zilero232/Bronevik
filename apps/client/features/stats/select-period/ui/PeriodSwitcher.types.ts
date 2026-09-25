import type { RecentPeriod } from '@bronevik/schemas';

export type PeriodSwitcherProps = {
  value: RecentPeriod;
  size?: 'md' | 'sm';
  className?: string;
  onChange: (value: RecentPeriod) => void;
};
