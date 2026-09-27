import type { SupertestList } from '@/shared/api/generated';

import type { SUPERTEST_SCOPES } from '../config';

export type SupertestScope = (typeof SUPERTEST_SCOPES)[number];

export type SupertestAnnouncement = SupertestList['announcements'][number];

export type SupertestTank = SupertestAnnouncement['tanks'][number];

export type SupertestVerdict = SupertestTank['verdict'];
