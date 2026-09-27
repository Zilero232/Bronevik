import { notFound } from 'next/navigation';

import type { RouteEntity } from '../route-meta';

export const requireRouteEntity = async (entity: Promise<RouteEntity>): Promise<RouteEntity> => {
  const found = await entity;

  if (!found.isFound) {
    notFound();
  }

  return found;
};
