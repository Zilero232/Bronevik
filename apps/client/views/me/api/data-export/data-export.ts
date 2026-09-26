import type { AnalyticsExport, RawStatsExport } from '@otmetki/schemas';

import { dataExportControllerAnalytics, dataExportControllerRaw } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getRawStatsExport = (): Promise<RawStatsExport> => fromSdk(() => dataExportControllerRaw(SESSION_REQUEST));

export const getAnalyticsExport = (): Promise<AnalyticsExport> => fromSdk(() => dataExportControllerAnalytics(SESSION_REQUEST));
