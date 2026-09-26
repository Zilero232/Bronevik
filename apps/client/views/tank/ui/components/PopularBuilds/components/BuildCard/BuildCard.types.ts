import type { PopularBuild, PopularBuilds } from '@otmetki/schemas';

export type BuildCardProps = {
  build: PopularBuild;
  source: PopularBuilds['source'];
  rank: number;
};
