'use client';

import { match } from 'ts-pattern';

import { PlusGate } from '@/features/plus/plus-gate';

import type { AnalyticsTabContentProps } from './AnalyticsTabContent.types';

import { MapsTab } from '../MapsTab';
import { OverviewTab } from '../OverviewTab';
import { PlatoonTab } from '../PlatoonTab';
import { RngTab } from '../RngTab';
import { TodayTab } from '../TodayTab';

export const AnalyticsTabContent = ({ tab }: AnalyticsTabContentProps) =>
  match(tab)
    .with('today', () => <TodayTab />)
    .with('overview', () => (
      <PlusGate feature='analytics'>
        <OverviewTab />
      </PlusGate>
    ))
    .with('maps', () => (
      <PlusGate feature='mapAdvisor'>
        <MapsTab />
      </PlusGate>
    ))
    .with('platoon', () => (
      <PlusGate feature='mapAdvisor'>
        <PlatoonTab />
      </PlusGate>
    ))
    .with('rng', () => (
      <PlusGate feature='battleAnalysis'>
        <RngTab />
      </PlusGate>
    ))
    .exhaustive();
