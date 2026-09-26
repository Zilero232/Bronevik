import type { ContentReport, CreateReport } from './moderation.types';

import { moderationControllerReport } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const createReport = (body: CreateReport): Promise<ContentReport> => fromSdk(() => moderationControllerReport({ ...SESSION_REQUEST, body }));
