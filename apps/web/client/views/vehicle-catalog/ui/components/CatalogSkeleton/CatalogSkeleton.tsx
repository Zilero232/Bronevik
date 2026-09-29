import { Skeleton } from '@/ui-kit';

import { VEHICLE_CATALOG_VIEW } from '../../../config';

import s from './CatalogSkeleton.module.scss';

export const CatalogSkeleton = () => (
  <div aria-busy className={s.root}>
    {VEHICLE_CATALOG_VIEW.skeletons.map((index) => (
      <Skeleton key={index} height={VEHICLE_CATALOG_VIEW.skeletonHeight} shape='block' />
    ))}
  </div>
);
