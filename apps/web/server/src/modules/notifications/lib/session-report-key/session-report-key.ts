import { SESSION_REPORT } from '../../config/watchers.constants';

export const sessionReportKey = (sessionId: string): string => `${SESSION_REPORT.dedupePrefix}${sessionId}`;
