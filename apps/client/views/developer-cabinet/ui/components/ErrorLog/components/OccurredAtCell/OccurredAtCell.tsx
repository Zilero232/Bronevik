import type { OccurredAtCellProps } from './OccurredAtCell.types';

import { TimeAgo } from '../../../TimeAgo';

import s from './OccurredAtCell.module.scss';

export const OccurredAtCell = ({ value }: OccurredAtCellProps) => <TimeAgo className={s.root} value={value} />;
