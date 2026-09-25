import type { ClanAttendance, ClanEvent, RecruitCandidate } from '../../../../../generated';

export type EventWithAttendance = ClanEvent & {
  attendance: ClanAttendance[];
};

export type ToEventViewInput = {
  event: EventWithAttendance;
  nicknames: ReadonlyMap<bigint, string>;
};

export type CandidateRow = RecruitCandidate;
