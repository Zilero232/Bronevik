import type { z } from 'zod';

import type { profileSummarySchema, profilesViewSchema } from './profiles.schemas';

export type ProfileSummary = z.infer<typeof profileSummarySchema>;

export type ProfilesView = z.infer<typeof profilesViewSchema>;

export type ProfileTarget = {
  clientPath: string | null;
  id: string;
};

export type SaveProfileInput = {
  clientPath: string | null;
  name: string;
};

export type RenameProfileInput = ProfileTarget & {
  name: string;
};

export type ImportProfileInput = {
  clientPath: string | null;
  code: string;
  name: string | null;
};
