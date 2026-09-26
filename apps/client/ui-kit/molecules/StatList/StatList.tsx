import { clsx } from 'clsx';
import { useLocale } from 'next-intl';

import { statValueText } from '@/shared/lib';

import type { StatListProps } from './StatList.types';

import s from './StatList.module.scss';

export const StatList = ({ title, items, columns = 2, className }: StatListProps) => {
  const locale = useLocale();

  return (
    <section className={clsx(s.root, className)}>
      {title && <h3 className={s.title}>{title}</h3>}
      <dl className={s.list} style={{ '--stat-columns': columns }}>
        {items.map(({ id, label, value, kind, suffix, isHighlighted = false, tone }) => (
          <div key={id} className={s.row} data-highlight={isHighlighted} data-tone={tone}>
            <dt className={s.label}>{label}</dt>
            <dd className={s.value}>
              {statValueText({ value, kind, locale })}
              {suffix && <span className={s.suffix}>{suffix}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
