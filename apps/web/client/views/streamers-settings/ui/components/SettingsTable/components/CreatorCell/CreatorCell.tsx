'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { LiveLamp } from '@/ui-kit';

import type { CreatorCellProps } from './CreatorCell.types';

import s from './CreatorCell.module.scss';

export const CreatorCell = ({ row }: CreatorCellProps) => {
  const t = useTranslations('streamerSettings.table');

  return (
    <span className={s.root}>
      <Link className={s.link} href={ROUTES.streamers.settings.profile(row.slug)}>
        {row.displayName}
      </Link>
      {row.isLive && <LiveLamp label={t('live')} size='sm' />}
    </span>
  );
};
