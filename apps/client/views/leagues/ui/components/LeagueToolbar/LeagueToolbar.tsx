'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { IconButton, SegmentedControl } from '@/ui-kit';

import type { LeagueToolbarProps } from './LeagueToolbar.types';

import s from './LeagueToolbar.module.scss';

export const LeagueToolbar = ({
  scope,
  scopeOptions,
  metric,
  metricOptions,
  weekStart,
  nav,
  onScopeChange,
  onMetricChange,
  onPrevious,
  onNext
}: LeagueToolbarProps) => {
  const t = useTranslations('social.leagues');
  const format = useFormatter();

  return (
    <div className={s.root}>
      <div className={s.filters}>
        <SegmentedControl
          aria-label={t('scope')}
          options={scopeOptions.map((value) => ({ value, label: t(`scopes.${value}`) }))}
          size='sm'
          value={scope}
          onChange={onScopeChange}
        />
        {scope === 'friends' && (
          <SegmentedControl
            aria-label={t('metric')}
            options={metricOptions.map((value) => ({ value, label: t(`metrics.${value}`) }))}
            size='sm'
            value={metric}
            onChange={onMetricChange}
          />
        )}
      </div>
      <div className={s.week}>
        <IconButton aria-label={t('week.previous')} disabled={!nav} size='sm' variant='ghost' onClick={onPrevious}>
          <ChevronLeft size={16} />
        </IconButton>
        <span className={s.label}>
          {weekStart ? t(nav?.isCurrent ? 'week.current' : 'week.of', { date: format.dateTime(new Date(weekStart), 'date') }) : t('week.loading')}
        </span>
        <IconButton aria-label={t('week.next')} disabled={!nav?.next} size='sm' variant='ghost' onClick={onNext}>
          <ChevronRight size={16} />
        </IconButton>
      </div>
    </div>
  );
};
