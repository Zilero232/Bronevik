import type { ContentReport, CreateReport } from './moderation.types';

import { moderationControllerReport } from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const createReport = (body: CreateReport): Promise<ContentReport> => fromSdk(() => moderationControllerReport({ ...SESSION_REQUEST, body }));
