import { match } from 'ts-pattern';

import type { Prisma } from '../../../../../generated';
import type { ReplaySearchQuery } from '../../replays.types';
import type { SearchWhereInput } from './replay-search.types';

export const publicReplayWhere = { visibility: 'public', status: 'parsed' } as const satisfies Prisma.ReplayWhereInput;

export const searchWhere = ({ query, playerAccountId }: SearchWhereInput): Prisma.ReplayWhereInput => {
  const participant = query.accountId === undefined ? playerAccountId : BigInt(query.accountId);

  return {
    ...publicReplayWhere,
    ...(query.tankId === undefined ? {} : { tankId: query.tankId }),
    ...(query.arenaId === undefined ? {} : { arenaId: query.arenaId }),
    ...(query.mode === undefined ? {} : { gameplayMode: query.mode }),
    ...(query.result === undefined ? {} : { result: query.result }),
    ...(query.minDamage === undefined ? {} : { damageDealt: { gte: query.minDamage } }),
    ...(participant === null ? {} : { playerAccountIds: { has: participant } })
  };
};

export const searchOrder = (sort: ReplaySearchQuery['sort']): Prisma.ReplayOrderByWithRelationInput[] =>
  match(sort)
    .with('damage', () => [{ damageDealt: { sort: 'desc', nulls: 'last' } }, { playedAt: 'desc' }] satisfies Prisma.ReplayOrderByWithRelationInput[])
    .with('xp', () => [{ xp: { sort: 'desc', nulls: 'last' } }, { playedAt: 'desc' }] satisfies Prisma.ReplayOrderByWithRelationInput[])
    .with('views', () => [{ views: 'desc' }, { playedAt: 'desc' }] satisfies Prisma.ReplayOrderByWithRelationInput[])
    .with('recent', () => [{ playedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }] satisfies Prisma.ReplayOrderByWithRelationInput[])
    .exhaustive();
