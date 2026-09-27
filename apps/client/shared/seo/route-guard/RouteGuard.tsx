import { notFound } from 'next/navigation';

import type { RouteGuardProps } from './RouteGuard.types';

import { JsonLd } from '../json-ld';

export const RouteGuard = async ({ entity, schema }: RouteGuardProps) => {
  const found = await entity;

  if (!found.isFound) {
    notFound();
  }

  return schema ? <JsonLd data={await schema(found)} /> : null;
};
