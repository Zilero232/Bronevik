import type { PopularBuild, PopularBuilds } from '@bronevik/schemas';

export type PresetCardProps = {
  preset: PopularBuild;
  source: PopularBuilds['source'];
};
