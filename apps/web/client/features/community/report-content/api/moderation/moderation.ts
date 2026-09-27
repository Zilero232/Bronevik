import { moderationControllerReport } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { ContentReport, CreateReport } from './moderation.types';

export const createReport = (body: CreateReport): Promise<ContentReport> => fromSdk(() => moderationControllerReport({ ...SESSION_REQUEST, body }));
