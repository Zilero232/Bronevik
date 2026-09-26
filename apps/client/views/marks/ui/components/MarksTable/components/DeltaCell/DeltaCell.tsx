import { DeltaValue } from '@/ui-kit';

import type { DeltaCellProps } from './DeltaCell.types';

import { thresholdVerdict } from '../../../../../lib/moe-thresholds';

export const DeltaCell = ({ delta }: DeltaCellProps) => <DeltaValue value={delta ?? 0} verdict={thresholdVerdict(delta)} />;
