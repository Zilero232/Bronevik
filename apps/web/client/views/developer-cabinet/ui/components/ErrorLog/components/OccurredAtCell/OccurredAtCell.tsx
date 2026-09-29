import { RelativeTime } from '@/ui-kit';

import type { OccurredAtCellProps } from './OccurredAtCell.types';

import s from './OccurredAtCell.module.scss';

export const OccurredAtCell = ({ value }: OccurredAtCellProps) => <RelativeTime className={s.root} value={value} />;
