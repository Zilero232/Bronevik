import { addHours, subHours } from 'date-fns';

import type { AccountSnapshot, ClanAttendance, ClanEvent, ClanMember, StatsMode } from '../../../../../generated';
import type { EventWithAttendance } from '../../mappers';

import { ATTENDANCE_MODES, CLAN_WORKSPACE } from '../../config';

export const clanId = 100;
export const scope = { clanId, userId: 'u1' };
export const startsAt = new Date('2026-09-20T18:00:00Z');
export const endsAt = addHours(startsAt, 2);
export const now = addHours(endsAt, CLAN_WORKSPACE.snapshotSlackHours);
export const [skirmish, defense] = ATTENDANCE_MODES.stronghold;

export const clanEvent = (fields: Partial<ClanEvent> = {}): ClanEvent => ({
  id: 'e1',
  clanId: BigInt(clanId),
  kind: 'stronghold',
  title: 'Stronghold',
  startsAt,
  endsAt,
  remindAt: null,
  remindedAt: null,
  data: null,
  createdAt: startsAt,
  ...fields
});

export const member = (accountId: bigint): ClanMember => ({
  accountId,
  clanId: BigInt(clanId),
  role: 'private',
  joinedAt: null,
  updatedAt: startsAt
});

export const attendance = (accountId: bigint, status: ClanAttendance['status']): ClanAttendance => ({
  eventId: 'e1',
  accountId,
  status,
  source: 'manual',
  updatedAt: startsAt
});

const snapshot = ({
  accountId,
  mode,
  capturedAt,
  battles
}: Pick<AccountSnapshot, 'accountId' | 'battles' | 'capturedAt' | 'mode'>): AccountSnapshot => ({
  accountId,
  mode,
  capturedAt,
  battles,
  wins: 0,
  losses: 0,
  draws: 0,
  damageDealt: 0n,
  damageReceived: 0n,
  frags: 0,
  spotted: 0,
  xp: 0n,
  battleAvgXp: 0,
  survived: 0,
  hits: 0,
  shots: 0,
  piercings: 0,
  piercingsReceived: 0,
  explosionHits: 0,
  directHitsReceived: 0,
  noDamageDirectHitsReceived: 0,
  explosionHitsReceived: null,
  capturePoints: 0,
  droppedCapturePoints: 0,
  avgDamageBlocked: 0,
  avgDamageAssisted: null,
  avgDamageAssistedRadio: null,
  avgDamageAssistedTrack: null,
  tankingFactor: null,
  stunAssistedDamage: 0n,
  stunNumber: 0,
  maxDamage: null,
  maxDamageTankId: null,
  maxFrags: null,
  maxFragsTankId: null,
  maxXp: null,
  maxXpTankId: null,
  globalRating: null
});

export const withAttendance: EventWithAttendance = { ...clanEvent(), attendance: [] };

const before = subHours(startsAt, 1);
const after = addHours(endsAt, 1);

export const played = ({ accountId, mode, grew }: { accountId: bigint; mode: StatsMode; grew: boolean }) => [
  snapshot({ accountId, mode, capturedAt: before, battles: 10 }),
  snapshot({ accountId, mode, capturedAt: after, battles: grew ? 12 : 10 })
];
