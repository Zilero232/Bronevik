import type { WeeklyReport, WeeklyReportInput } from './weekly-report.types';

export const weeklyReport = ({ events, attendance, newCandidates, inactiveMembers }: WeeklyReportInput): WeeklyReport => {
  const settled = attendance.filter((status) => status === 'attended' || status === 'absent');
  const attended = settled.filter((status) => status === 'attended').length;

  return {
    events,
    attendanceRate: settled.length === 0 ? null : attended / settled.length,
    newCandidates,
    inactiveMembers
  };
};
