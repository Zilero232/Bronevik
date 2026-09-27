import { useFormatter } from 'next-intl';

import type { ResultFigureProps } from './ResultFigure.types';

import s from './ResultFigure.module.scss';

export const ResultFigure = ({ label, value, fallback, suffix, format, hint, tone = 'neutral', size = 'lg' }: ResultFigureProps) => {
  const formatter = useFormatter();

  return (
    <div className={s.root} data-size={size} data-tone={tone}>
      <span className={s.label}>{label}</span>
      {value === null ? (
        <span className={s.fallback}>{fallback ?? '—'}</span>
      ) : (
        <span className={s.value}>
          {formatter.number(value, format)}
          {suffix}
        </span>
      )}
      {hint && <span className={s.hint}>{hint}</span>}
    </div>
  );
};
