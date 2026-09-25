import type { z } from 'zod';

import type {
  buildOptionsSchema,
  crewSkillOptionSchema,
  fieldModificationStepSchema,
  loadoutRequestSchema,
  loadoutResultSchema,
  modifierEffectSchema,
  moduleOptionSchema,
  popularBuildSchema,
  popularBuildsQuerySchema,
  popularBuildsSchema,
  provisionKindSchema,
  provisionOptionSchema,
  shellStatsSchema,
  vehicleProfileIdSchema,
  vehicleStatsSchema
} from './builds.schemas';

export type VehicleProfileId = z.infer<typeof vehicleProfileIdSchema>;
export type ShellStats = z.infer<typeof shellStatsSchema>;
export type VehicleStats = z.infer<typeof vehicleStatsSchema>;
export type ModifierEffect = z.infer<typeof modifierEffectSchema>;
export type ProvisionKind = z.infer<typeof provisionKindSchema>;
export type ProvisionOption = z.infer<typeof provisionOptionSchema>;
export type CrewSkillOption = z.infer<typeof crewSkillOptionSchema>;
export type ModuleOption = z.infer<typeof moduleOptionSchema>;
export type FieldModificationStep = z.infer<typeof fieldModificationStepSchema>;
export type BuildOptions = z.infer<typeof buildOptionsSchema>;
export type LoadoutRequest = z.input<typeof loadoutRequestSchema>;
export type ParsedLoadoutRequest = z.output<typeof loadoutRequestSchema>;
export type LoadoutResult = z.infer<typeof loadoutResultSchema>;
export type PopularBuildsQuery = z.infer<typeof popularBuildsQuerySchema>;
export type PopularBuild = z.infer<typeof popularBuildSchema>;
export type PopularBuilds = z.infer<typeof popularBuildsSchema>;
