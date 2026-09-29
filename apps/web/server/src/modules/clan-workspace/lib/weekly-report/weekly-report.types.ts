import type { AttendanceStatus } from '../../../../../generated';
import type { WeeklyReportView } from '../../clan-workspace.types';

export type WeeklyReportInput = {
  events: number;
  attendance: readonly AttendanceStatus[];
  newCandidates: number;
  inactiveMembers: number;
};

export type WeeklyReport = Pick<WeeklyReportView, 'attendanceRate' | 'events' | 'inactiveMembers' | 'newCandidates'>;
