'use client';

import { ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { useMobileStats } from '../../../model/hooks';
import { StatsBoard } from '../StatsBoard';
import { SummaryChip } from './components';

import s from './MobileStats.module.scss';

export const MobileStats = () => {
  const t = useTranslations('builds.stats');
  const { summary, isOpen, onToggle } = useMobileStats();
  const sheetId = useId();

  return (
    <div className={s.root}>
      {isOpen && (
        <div className={s.sheet} id={sheetId}>
          <StatsBoard />
        </div>
      )}
      <button aria-controls={sheetId} aria-expanded={isOpen} className={s.bar} type='button' onClick={onToggle}>
        <span className={s.summary}>
          <span className={s.srOnly}>{t('summary')}</span>
          {summary.map((row) => (
            <SummaryChip key={row.key} row={row} />
          ))}
        </span>
        <span className={s.toggle}>
          {isOpen ? t('hide') : t('showAll')}
          <ChevronUp className={s.chevron} data-open={isOpen} size={14} />
        </span>
      </button>
    </div>
  );
};
