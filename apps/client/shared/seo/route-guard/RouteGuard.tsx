import { notFound } from 'next/navigation';

import type { RouteGuardProps } from './RouteGuard.types';

export const RouteGuard = async ({ entity }: RouteGuardProps) => {
  if (!(await entity).isFound) {
    notFound();
  }

  return null;
};
