'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { CoverageCellProps } from './CoverageCell.types';

import s from './CoverageCell.module.scss';

export const CoverageCell = ({ battles, players, isEnough }: CoverageCellProps) => {
  const t = useTranslations('buildsCatalog.table');
  const format = useFormatter();

  return (
    <span className={s.root} data-enough={isEnough}>
      <span className={s.battles}>{format.number(battles)}</span>
      <span className={s.players}>{isEnough ? t('players', { count: players }) : t('noData')}</span>
    </span>
  );
};
