import type { RouteGuardProps } from './RouteGuard.types';

import { JsonLd } from '../json-ld';
import { requireRouteEntity } from '../require-route-entity';

export const RouteGuard = async ({ entity, schema }: RouteGuardProps) => {
  const found = await requireRouteEntity(entity);

  return schema ? <JsonLd data={await schema(found)} /> : null;
};
