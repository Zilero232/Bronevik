import type { RouteEntity } from '../route-meta';

export type RouteGuardProps = {
  entity: Promise<RouteEntity>;
  schema?: (entity: RouteEntity) => Promise<object>;
};
