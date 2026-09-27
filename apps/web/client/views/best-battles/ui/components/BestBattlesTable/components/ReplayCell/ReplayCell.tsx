'use client';

import { Film } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { ReplayCellProps } from './ReplayCell.types';

import s from './ReplayCell.module.scss';

export const ReplayCell = ({ replayId }: ReplayCellProps) => {
  const t = useTranslations('bestBattles');

  return replayId ? (
    <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.replays.detail(replayId)}>
      <Film size={14} />
      {t('replay')}
    </Link>
  ) : (
    <span className={s.none}>—</span>
  );
};
