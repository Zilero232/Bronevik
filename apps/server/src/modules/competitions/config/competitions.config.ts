import type { Prisma } from '../../../../generated';

import { FEATURES } from '../../../config';

export const COMPETITION_QUEUE = {
  name: 'competitions',
  jobs: { score: 'score' }
} as const;

export const COMPETITION_SCHEDULES = [
  {
    id: 'competitions-score',
    queue: COMPETITION_QUEUE.name,
    name: COMPETITION_QUEUE.jobs.score,
    repeat: { pattern: '*/15 * * * *' },
    enabled: FEATURES.competitions
  }
] as const;

export const COMPETITION_RUN = {
  finishGraceHours: 6,
  battlesFetchFactor: 4,
  maxActivePerOwner: 5,
  inviteAlphabet: '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
  slugSuffixAlphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
  slugSuffixLength: 6,
  plusFeature: 'privateCompetitions'
} as const;

export const COMPETITION_SUMMARY_INCLUDE = {
  owner: { select: { name: true } },
  teams: { select: { id: true, name: true, score: true, battles: true }, orderBy: [{ score: 'desc' }, { battles: 'asc' }], take: 1 },
  _count: { select: { teams: true, entries: true } }
} as const satisfies Prisma.CompetitionInclude;
