import type { HttpMethod } from '../../../../../lib/openapi-endpoints';

export type MethodBadgeProps = {
  method: HttpMethod;
  className?: string;
};
