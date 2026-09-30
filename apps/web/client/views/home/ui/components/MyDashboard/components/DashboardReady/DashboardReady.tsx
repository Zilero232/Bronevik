'use client';

import dynamic from 'next/dynamic';

import type { DashboardBodyProps } from '../DashboardBody';

import { DashboardSkeleton } from '../DashboardSkeleton';

export const DashboardReady = dynamic<DashboardBodyProps>(() => import('../DashboardBody').then((module) => module.DashboardBody), {
  ssr: false,
  loading: () => <DashboardSkeleton />
});
