import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import s from './ClanSkeleton.module.scss';

const TILES = 5;

export const ClanSkeleton = () => {
  const t = useTranslations('clans.clan');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      <div className={s.hero}>
        <div className={s.lines}>
          <Skeleton height={14} width={180} />
          <Skeleton height={72} width='min(520px, 80vw)' />
          <Skeleton height={16} width='min(360px, 60vw)' />
        </div>
        <Skeleton className={s.ring} height={148} shape='circle' width={148} />
      </div>
      <div className={s.tiles}>
        {Array.from({ length: TILES }, (_, index) => (
          <Skeleton key={index} height={92} shape='block' />
        ))}
      </div>
      <Skeleton height={420} shape='block' />
    </div>
  );
};
