import type { PopularBuild, PopularBuilds } from '@otmetki/schemas';

export type PresetCardProps = {
  preset: PopularBuild;
  source: PopularBuilds['source'];
};
