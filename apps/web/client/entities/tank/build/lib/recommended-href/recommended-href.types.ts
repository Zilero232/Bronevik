import type { BuildCohort, BuildMode } from '@otmetki/schemas';

export type RecommendedHrefInput = {
  slug: string;
  mode: BuildMode;
  cohort: BuildCohort;
};
