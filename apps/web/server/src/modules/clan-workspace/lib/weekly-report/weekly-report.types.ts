import type { AttendanceStatus } from '../../../../../generated';

export type WeeklyReportInput = {
  events: number;
  attendance: readonly AttendanceStatus[];
  newCandidates: number;
  inactiveMembers: number;
};

export type WeeklyReport = {
  events: number;
  attendanceRate: number | null;
  newCandidates: number;
  inactiveMembers: number;
};
