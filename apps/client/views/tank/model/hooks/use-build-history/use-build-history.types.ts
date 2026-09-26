import type { BuildCohort, BuildMode } from '@otmetki/schemas';

export type UseBuildHistoryInput = {
  mode: BuildMode;
  cohort: BuildCohort;
};
