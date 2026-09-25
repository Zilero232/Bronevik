import { z } from 'zod';

import type { CandidateStats, CandidateView, ClanEventView } from '../../clan-workspace.types';
import type { CandidateRow, ToEventViewInput } from './views.types';

import { toIso } from '../../../../common/lib';
import { candidateStatsSchema } from '../../dto/clan-workspace.schemas';
import { EVENT_KIND_FROM_DB } from './views.constants';

const nullableStats = candidateStatsSchema.nullable().catch(null);

export const readCandidateStats = (value: unknown): CandidateStats | null => nullableStats.parse(value ?? null);

export const toClanEventView = ({ event, nicknames }: ToEventViewInput): ClanEventView => ({
  id: event.id,
  kind: EVENT_KIND_FROM_DB[event.kind],
  title: event.title,
  startsAt: event.startsAt.toISOString(),
  endsAt: toIso(event.endsAt),
  remindAt: toIso(event.remindAt),
  remindedAt: toIso(event.remindedAt),
  attendance: event.attendance.map((row) => ({
    accountId: Number(row.accountId),
    nickname: nicknames.get(row.accountId) ?? null,
    status: row.status,
    source: row.source
  }))
});

export const toCandidateView = (candidate: CandidateRow): CandidateView => ({
  id: candidate.id,
  accountId: Number(candidate.accountId),
  status: candidate.status,
  notes: candidate.notes,
  stats: readCandidateStats(candidate.statsSnapshot),
  createdAt: candidate.createdAt.toISOString(),
  updatedAt: candidate.updatedAt.toISOString()
});

export const eventDataSchema = z.object({ attendanceSyncedAt: z.string().optional() }).catch({});
