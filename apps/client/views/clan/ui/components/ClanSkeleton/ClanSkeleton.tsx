import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import s from './ClanSkeleton.module.scss';

export const ClanSkeleton = () => {
  const t = useTranslations('clans.clan');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      <div className={s.head}>
        <Skeleton height={64} shape='block' width={64} />
        <div className={s.lines}>
          <Skeleton height={28} width='min(420px, 70vw)' />
          <Skeleton height={14} width='min(320px, 60vw)' />
        </div>
      </div>
      <Skeleton height={64} shape='block' />
      <Skeleton height={420} shape='block' />
    </div>
  );
};
