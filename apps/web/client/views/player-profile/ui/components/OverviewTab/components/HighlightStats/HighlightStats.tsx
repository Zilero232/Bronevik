'use client';

import { useTranslations } from 'next-intl';

import { KeyFigure } from '@/ui-kit';

import { useHighlightStats } from '../../../../../model/hooks';

import s from './HighlightStats.module.scss';

export const HighlightStats = () => {
  const t = useTranslations('profile.overview.highlights');
  const { items, hasStats } = useHighlightStats();

  return (
    <section aria-labelledby='profile-highlights' className={s.root}>
      <h2 className={s.title} id='profile-highlights'>
        {t('title')}
        {!hasStats && <span className={s.note}>{t('empty')}</span>}
      </h2>
      <ul className={s.grid}>
        {items.map(({ key, label, value, tone, format, suffix, trend }) => (
          <li key={key} className={s.card} data-tone={tone}>
            <KeyFigure
              format={format}
              isFramed={false}
              label={label}
              size='lg'
              suffix={value === null ? undefined : suffix}
              tone={tone}
              trend={trend.length > 1 ? trend : undefined}
              value={value ?? '—'}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
