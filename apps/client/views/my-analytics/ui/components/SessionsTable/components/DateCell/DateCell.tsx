import { useFormatter } from 'next-intl';

import type { DateCellProps } from './DateCell.types';

import s from './DateCell.module.scss';

export const DateCell = ({ value, withTime = false }: DateCellProps) => {
  const format = useFormatter();

  return (
    <time className={s.root} dateTime={value}>
      {format.dateTime(new Date(value), withTime ? 'dateTime' : 'date')}
    </time>
  );
};
