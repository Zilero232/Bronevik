import type { DeltaCellProps } from './DeltaCell.types';

import { DeltaValue } from '../../atoms';

export const DeltaCell = ({ value, isLowerBetter = false, suffix }: DeltaCellProps) =>
  value === null ? null : <DeltaValue isLowerBetter={isLowerBetter} suffix={suffix} value={value} />;
