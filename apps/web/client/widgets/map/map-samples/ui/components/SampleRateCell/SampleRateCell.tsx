import type { SampleRateCellProps } from './SampleRateCell.types';

import s from './SampleRateCell.module.scss';

export const SampleRateCell = ({ value, note }: SampleRateCellProps) => (note ? <span className={s.note}>{note}</span> : value);
