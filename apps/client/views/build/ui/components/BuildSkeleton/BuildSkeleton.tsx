import { Skeleton } from '@/ui-kit';

import { BUILD_SKELETON } from '../../../config';

import s from './BuildSkeleton.module.scss';

export const BuildSkeleton = () => (
  <div aria-busy className={s.root}>
    <Skeleton height={120} />
    <Skeleton height={36} />
    <div className={s.presets}>
      {BUILD_SKELETON.presets.map((preset) => (
        <Skeleton key={preset} height={120} />
      ))}
    </div>
    <div className={s.layout}>
      <div className={s.panels}>
        {BUILD_SKELETON.panels.map((height) => (
          <Skeleton key={height} height={height} />
        ))}
      </div>
      <div className={s.stats}>
        {BUILD_SKELETON.statLines.map((line) => (
          <Skeleton key={line} height={28} />
        ))}
      </div>
    </div>
  </div>
);
