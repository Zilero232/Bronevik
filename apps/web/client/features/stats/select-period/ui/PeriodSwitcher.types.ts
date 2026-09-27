import type { RecentPeriod } from '@otmetki/schemas';

export type PeriodSwitcherProps = {
  value: RecentPeriod;
  size?: 'md' | 'sm';
  className?: string;
  onChange: (value: RecentPeriod) => void;
};
