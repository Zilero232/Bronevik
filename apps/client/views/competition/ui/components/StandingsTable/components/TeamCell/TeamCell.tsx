'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { TeamCellProps } from './TeamCell.types';

import s from './TeamCell.module.scss';

export const TeamCell = ({ name, isMine }: TeamCellProps) => {
  const t = useTranslations('competitions.standings');

  return (
    <span className={s.root}>
      <span className={s.name}>{name}</span>
      {isMine && <Badge tone='accent'>{t('mine')}</Badge>}
    </span>
  );
};
