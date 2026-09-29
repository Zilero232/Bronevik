import type { z } from 'zod';

import type { Prisma } from '../../../generated';
import type {
  supertestAnnouncementSchema,
  supertestChangeSchema,
  supertestListSchema,
  supertestMineSchema,
  supertestTankSchema,
  supertestTotalsSchema
} from './dto';
import type { ParsedTank } from './lib';

export type SupertestChangeView = z.infer<typeof supertestChangeSchema>;

export type SupertestTankView = z.infer<typeof supertestTankSchema>;

export type SupertestAnnouncementView = z.infer<typeof supertestAnnouncementSchema>;

export type SupertestTotals = z.infer<typeof supertestTotalsSchema>;

export type SupertestList = z.infer<typeof supertestListSchema>;

export type SupertestMine = z.infer<typeof supertestMineSchema>;

export type AnnouncementSource = {
  url: string;
  title: string;
  summary: string | null;
  image: string | null;
  source: string;
  publishedAt: Date;
};

export type StoreAnnouncementInput = {
  announcement: AnnouncementSource;
  tanks: readonly ParsedTank[];
  now: Date;
};

export type ChangeRowInput = Omit<Prisma.SupertestChangeCreateManyInput, 'announcementId' | 'position'>;
