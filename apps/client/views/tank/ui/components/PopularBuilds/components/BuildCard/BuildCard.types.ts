import type { PopularBuild, PopularBuilds } from '@bronevik/schemas';

export type BuildCardProps = {
  build: PopularBuild;
  source: PopularBuilds['source'];
  rank: number;
};
