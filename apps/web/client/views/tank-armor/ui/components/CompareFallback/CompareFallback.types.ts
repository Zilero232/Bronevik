import type { ArmorCompareStatus } from '../../../lib/compare-status';
import type { ArmorLimitProps } from '../ArmorLimit';

export type CompareFallbackProps = {
  status: ArmorCompareStatus;
  quota: ArmorLimitProps;
  onRetry: () => void;
};
