import type { z } from 'zod';

import type { changelogReleaseSchema, componentChangeSchema, whatsNewSchema } from './whats-new.schemas';

export type ComponentChange = z.infer<typeof componentChangeSchema>;

export type ChangelogRelease = z.infer<typeof changelogReleaseSchema>;

export type WhatsNew = z.infer<typeof whatsNewSchema>;
