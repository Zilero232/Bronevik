import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import s from './ProfileSkeleton.module.scss';

export const ProfileSkeleton = () => {
  const t = useTranslations('profile');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      <div className={s.hero}>
        <div className={s.identity}>
          <Skeleton height={72} shape='circle' width={72} />
          <div className={s.lines}>
            <Skeleton height={14} width={160} />
            <Skeleton height={40} width='min(360px, 70vw)' />
            <Skeleton height={14} width={240} />
          </div>
        </div>
        <Skeleton className={s.ring} height={148} shape='circle' width={148} />
      </div>
      <Skeleton height={44} shape='block' />
      <div className={s.tiles}>
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} height={112} shape='block' />
        ))}
      </div>
    </div>
  );
};
