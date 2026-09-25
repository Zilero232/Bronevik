import { Skeleton } from '@/ui-kit';

import s from './BuildSkeleton.module.scss';

const PANELS = [220, 260, 200, 240];

const STAT_LINES = Array.from({ length: 12 }, (_, index) => index);

export const BuildSkeleton = () => (
  <div aria-busy className={s.root}>
    <Skeleton className={s.hero} height={260} />
    <Skeleton height={56} />
    <div className={s.presets}>
      <Skeleton height={148} />
      <Skeleton height={148} />
      <Skeleton height={148} />
    </div>
    <div className={s.layout}>
      <div className={s.panels}>
        {PANELS.map((height) => (
          <Skeleton key={height} height={height} />
        ))}
      </div>
      <div className={s.stats}>
        {STAT_LINES.map((line) => (
          <Skeleton key={line} height={28} />
        ))}
      </div>
    </div>
  </div>
);
