import type { z } from 'zod';

import type {
  modpackChangelogChangeSchema,
  modpackChangelogQuerySchema,
  modpackChangelogReleaseSchema,
  modpackChangelogSchema,
  modpackDownloadSchema,
  modpackLatestQuerySchema,
  modpackLatestReleaseSchema,
  modpackManagerReleaseSchema,
  modpackManagerUpdateQuerySchema,
  modpackManagerUpdateSchema,
  modpackReleaseChangeSchema,
  modpackReleaseIndexSchema,
  modpackReleasePackageSchema,
  modpackReleaseSchema,
  modpackReleasesStatusSchema,
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
export type ModpackDownload = z.infer<typeof modpackDownloadSchema>;
export type ModpackReleasesStatus = z.infer<typeof modpackReleasesStatusSchema>;
export type ModpackReleaseChange = z.infer<typeof modpackReleaseChangeSchema>;
export type ModpackChangelogQuery = z.infer<typeof modpackChangelogQuerySchema>;
export type ModpackChangelogChange = z.infer<typeof modpackChangelogChangeSchema>;
export type ModpackChangelogRelease = z.infer<typeof modpackChangelogReleaseSchema>;
export type ModpackChangelog = z.infer<typeof modpackChangelogSchema>;
