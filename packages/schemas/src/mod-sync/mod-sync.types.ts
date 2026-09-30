import type { z } from 'zod';

import type {
  modComponentSetSchema,
  modProfileDataSchema,
  modProfilesLibrarySchema,
  modProfilesWriteRequestSchema,
  modSetsLibrarySchema,
  modSetsWriteRequestSchema,
  modSyncLibrariesSchema,
  modSyncModeSchema,
  modSyncProfileSchema,
  modSyncReadRequestSchema,
  modSyncTombstoneSchema
} from './mod-sync.schemas';

export type ModSyncMode = z.infer<typeof modSyncModeSchema>;
export type ModSyncTombstone = z.infer<typeof modSyncTombstoneSchema>;
export type ModComponentSet = z.infer<typeof modComponentSetSchema>;
export type ModProfileData = z.infer<typeof modProfileDataSchema>;
export type ModSyncProfile = z.infer<typeof modSyncProfileSchema>;
export type ModSetsLibrary = z.infer<typeof modSetsLibrarySchema>;
export type ModProfilesLibrary = z.infer<typeof modProfilesLibrarySchema>;
export type ModSyncLibraries = z.infer<typeof modSyncLibrariesSchema>;
export type ModSyncReadRequest = z.infer<typeof modSyncReadRequestSchema>;
export type ModSetsWriteRequest = z.infer<typeof modSetsWriteRequestSchema>;
export type ModProfilesWriteRequest = z.infer<typeof modProfilesWriteRequestSchema>;
