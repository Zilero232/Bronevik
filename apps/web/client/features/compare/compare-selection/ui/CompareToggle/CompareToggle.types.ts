import type { CompareEntry } from '../../lib/compare-items';

export type CompareToggleProps = {
  entry: CompareEntry;
  variant?: 'button' | 'icon';
  className?: string;
};
