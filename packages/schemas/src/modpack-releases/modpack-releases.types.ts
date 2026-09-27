import type { z } from 'zod';

import type {
  modpackLatestQuerySchema,
  modpackLatestReleaseSchema,
  modpackManagerReleaseSchema,
  modpackManagerUpdateQuerySchema,
  modpackManagerUpdateSchema,
  modpackReleaseIndexSchema,
  modpackReleasePackageSchema,
  modpackReleaseSchema,
  modpackReleaseStatusSchema
} from './modpack-releases.schemas';

export type ModpackReleasePackage = z.infer<typeof modpackReleasePackageSchema>;
export type ModpackRelease = z.infer<typeof modpackReleaseSchema>;
export type ModpackManagerRelease = z.infer<typeof modpackManagerReleaseSchema>;
export type ModpackReleaseIndex = z.infer<typeof modpackReleaseIndexSchema>;
export type ModpackReleaseIndexInput = z.input<typeof modpackReleaseIndexSchema>;
export type ModpackLatestQuery = z.infer<typeof modpackLatestQuerySchema>;
export type ModpackReleaseStatus = z.infer<typeof modpackReleaseStatusSchema>;
export type ModpackLatestRelease = z.infer<typeof modpackLatestReleaseSchema>;
export type ModpackManagerUpdateQuery = z.infer<typeof modpackManagerUpdateQuerySchema>;
export type ModpackManagerUpdate = z.infer<typeof modpackManagerUpdateSchema>;
