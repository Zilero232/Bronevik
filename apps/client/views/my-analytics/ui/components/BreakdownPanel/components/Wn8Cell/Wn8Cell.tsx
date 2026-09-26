import { useFormatter } from 'next-intl';

import { ratingTone } from '@/shared/lib';

import type { Wn8CellProps } from './Wn8Cell.types';

import s from './Wn8Cell.module.scss';

export const Wn8Cell = ({ value }: Wn8CellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root} data-tone={value === null ? undefined : ratingTone({ scale: 'wn8', value })}>
      {value === null ? '—' : format.number(value, 'integer')}
    </span>
  );
};
