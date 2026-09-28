import { Skeleton } from '../../atoms';

import s from './PageHeroFallback.module.scss';

export const PageHeroFallback = () => (
  <div aria-busy className={s.root}>
    <div className={s.inner}>
      <Skeleton height={14} width={160} />
      <Skeleton height={36} width='min(420px, 80%)' />
      <Skeleton height={16} width='min(560px, 90%)' />
    </div>
  </div>
);
