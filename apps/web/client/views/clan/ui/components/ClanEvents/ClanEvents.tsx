'use client';

import type { ClanEventsProps } from './ClanEvents.types';

import { EventTimeline, MovesChart } from './components';

import s from './ClanEvents.module.scss';

export const ClanEvents = ({ clanId, now }: ClanEventsProps) => (
  <div className={s.grid}>
    <EventTimeline clanId={clanId} />
    <MovesChart clanId={clanId} now={now} />
  </div>
);
