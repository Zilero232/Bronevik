import type { ServersOnlineInput, SmoothNoiseInput, TotalOnlineInput } from './online.types';

import { MOCK_ONLINE, MOCK_SALT } from '../../config';
import { unitFloat } from '../random';
import { dayOf, hourOf, isWeekend, weekdayOf } from '../time';

const smoothNoise = ({ seed, at, key }: SmoothNoiseInput): number => {
  const bucket = at / MOCK_ONLINE.bucketSec;
  const index = Math.floor(bucket);
  const fraction = bucket - index;
  const left = unitFloat(seed, MOCK_SALT.online, key, index) - 0.5;
  const right = unitFloat(seed, MOCK_SALT.online, key, index + 1) - 0.5;

  return left + (right - left) * fraction;
};

export const totalOnline = ({ seed, at }: TotalOnlineInput): number => {
  const hour = hourOf(at);
  const index = Math.floor(hour);
  const from = MOCK_ONLINE.hourly[index % 24] ?? 0;
  const to = MOCK_ONLINE.hourly[(index + 1) % 24] ?? 0;
  const day = dayOf(at);
  const weekend = isWeekend(day) && hour >= MOCK_ONLINE.weekendDaytime.from && hour < MOCK_ONLINE.weekendDaytime.to;
  const base = (from + (to - from) * (hour - index)) * (MOCK_ONLINE.weekday[weekdayOf(day)] ?? 1) * (weekend ? MOCK_ONLINE.weekendDaytime.factor : 1);

  return Math.round(base * (1 + 2 * MOCK_ONLINE.noise * smoothNoise({ seed, at, key: 0 })));
};

export const serversOnline = ({ seed, at }: ServersOnlineInput) => {
  const total = totalOnline({ seed, at });

  return MOCK_ONLINE.servers.map(([server, share], index) => ({
    server,
    players_online: Math.max(0, Math.round(total * share * (1 + 2 * MOCK_ONLINE.serverNoise * smoothNoise({ seed, at, key: index + 1 }))))
  }));
};
