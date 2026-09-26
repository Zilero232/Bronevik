import type { NumberFormatName } from '@/shared/i18n';
import type { DeltaVerdict } from '@/shared/lib';

export type DeltaValueProps = {
  value: number;
  verdict?: DeltaVerdict;
  isLowerBetter?: boolean;
  format?: Intl.NumberFormatOptions | NumberFormatName;
  suffix?: string;
  className?: string;
};
