import type { RecommendedHrefInput } from './recommended-href.types';

import { BUILD_PRESETS, BUILD_URL } from '../../config';

export const recommendedBuildHref = ({ slug, mode, cohort }: RecommendedHrefInput): string => {
  const [preset] = BUILD_PRESETS;
  const params = new URLSearchParams({ [BUILD_URL.preset]: preset, [BUILD_URL.mode]: mode, [BUILD_URL.cohort]: cohort });

  return `/builds/${slug}?${params.toString()}`;
};
