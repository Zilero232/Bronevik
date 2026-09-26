import { DeltaValue } from '@/ui-kit';

import type { DeltaCellProps } from './DeltaCell.types';

import { deltaVerdict } from '../../../lib';

export const DeltaCell = ({ value, isLowerBetter = false, suffix }: DeltaCellProps) =>
  value === null ? null : <DeltaValue suffix={suffix} value={value} verdict={deltaVerdict({ value, isLowerBetter })} />;
