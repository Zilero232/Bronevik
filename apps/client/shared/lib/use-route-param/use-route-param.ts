'use client';

import { useParams } from 'next/navigation';

import { decodeRouteParam } from '../route-param';

export const useRouteParam = (name: string): string => {
  const value = useParams<Record<string, string>>()[name];

  return decodeRouteParam(value ?? '');
};
