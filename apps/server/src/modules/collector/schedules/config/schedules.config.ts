import type { ScheduleDefinition } from '../schedules.types';

import { FEATURES } from '../../../../config';
import { JOB, QUEUE } from '../../contracts';

export const SCHEDULE_TIMEZONE = 'Europe/Moscow';

export const SCHEDULES: readonly ScheduleDefinition[] = [
  { id: 'tier-a-dispatch', queue: QUEUE.poll, name: JOB.poll.dispatch, repeat: { every: 60_000 }, needsLesta: true },
  {
    id: 'tier-b-dispatch',
    queue: QUEUE.sweep,
    name: JOB.sweep.dispatch,
    repeat: { pattern: '0 3 * * *' },
    enabled: FEATURES.tierB,
    needsLesta: true
  },
  {
    id: 'dormant-dispatch',
    queue: QUEUE.sweep,
    name: JOB.sweep.dormantDispatch,
    repeat: { pattern: '0 4 * * 0' },
    enabled: FEATURES.tierB,
    needsLesta: true
  },
  { id: 'population-seed', queue: QUEUE.sweep, name: JOB.sweep.seed, repeat: { pattern: '0 5 * * 1' }, enabled: FEATURES.seed, needsLesta: true },
  {
    id: 'clans-tracked',
    queue: QUEUE.clans,
    name: JOB.clans.dispatch,
    repeat: { pattern: '5 * * * *' },
    data: { scope: 'tracked' },
    enabled: FEATURES.clans,
    needsLesta: true
  },
  {
    id: 'clans-all',
    queue: QUEUE.clans,
    name: JOB.clans.dispatch,
    repeat: { pattern: '30 2 * * *' },
    data: { scope: 'all' },
    enabled: FEATURES.clans,
    needsLesta: true
  },
  { id: 'game-version-check', queue: QUEUE.reference, name: JOB.reference.versionCheck, repeat: { pattern: '*/30 * * * *' }, needsLesta: true },
  {
    id: 'encyclopedia-nightly',
    queue: QUEUE.reference,
    name: JOB.reference.encyclopedia,
    repeat: { pattern: '0 2 * * *' },
    data: { force: true },
    needsLesta: true
  },
  { id: 'wn8-expected-daily', queue: QUEUE.reference, name: JOB.reference.wn8Expected, repeat: { pattern: '0 6 * * *' }, enabled: FEATURES.wn8Xvm },
  {
    id: 'moe-thresholds-daily',
    queue: QUEUE.reference,
    name: JOB.reference.moeThresholds,
    repeat: { pattern: '15 6 * * *' },
    enabled: FEATURES.moePoliroid
  },
  {
    id: 'mastery-thresholds-daily',
    queue: QUEUE.reference,
    name: JOB.reference.masteryThresholds,
    repeat: { pattern: '30 6 * * *' },
    needsLesta: true
  },
  { id: 'server-stats-hourly', queue: QUEUE.aggregate, name: JOB.aggregate.serverStats, repeat: { pattern: '20 * * * *' } },
  { id: 'tank-percentiles-daily', queue: QUEUE.aggregate, name: JOB.aggregate.tankPercentiles, repeat: { pattern: '0 7 * * *' } },
  { id: 'tier-maintenance-daily', queue: QUEUE.aggregate, name: JOB.aggregate.tierMaintenance, repeat: { pattern: '0 1 * * *' } },
  { id: 'news-rss', queue: QUEUE.news, name: JOB.news.rss, repeat: { pattern: '*/30 * * * *' }, enabled: FEATURES.news },
  { id: 'purge-dispatch', queue: QUEUE.purge, name: JOB.purge.dispatch, repeat: { every: 10 * 60_000 } },
  {
    id: 'sessions-close',
    queue: QUEUE.developerWebhooks,
    name: JOB.developerWebhooks.closeSessions,
    repeat: { every: 5 * 60_000 },
    enabled: FEATURES.sessionClose
  }
];
