import type { modpackLocalizedSchema } from '@otmetki/schemas';
import type { z } from 'zod';

export type LocalizedNotes = z.infer<typeof modpackLocalizedSchema>;

export type ChangelogSections = Partial<Record<keyof LocalizedNotes, string[]>>;

export type ChangelogEntries = ReadonlyMap<string, LocalizedNotes>;

export type ComponentNotesInput = {
  entries: ChangelogEntries;
  id: string;
  version: string;
};

export type ReleaseNotesInput = {
  entries: ChangelogEntries;
  version: string;
};
