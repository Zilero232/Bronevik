import type { DeltaVerdict, DeltaVerdictInput, DeltaView, DeltaViewInput } from './delta-verdict.types';

import { DELTA_VERDICT } from './delta-verdict.constants';

export const deltaVerdict = ({ value, isLowerBetter = false, digits }: DeltaVerdictInput): DeltaVerdict => {
  if (!Number.isFinite(value)) {
    return 'same';
  }

  const shown = digits === undefined ? value : Number(value.toFixed(digits));

  if (shown === 0) {
    return 'same';
  }

  return shown > 0 !== isLowerBetter ? 'better' : 'worse';
};

export const deltaDigits = (options: Intl.NumberFormatOptions): number =>
  (options.maximumFractionDigits ?? DELTA_VERDICT.digits) + (options.style === 'percent' ? DELTA_VERDICT.percentShift : 0);

export const deltaView = ({ value, verdict, isLowerBetter, options }: DeltaViewInput): DeltaView => {
  const resolved = verdict ?? deltaVerdict({ value, isLowerBetter, digits: deltaDigits(options) });

  return { isKnown: Number.isFinite(value), verdict: resolved, shown: resolved === 'same' ? 0 : value };
};
