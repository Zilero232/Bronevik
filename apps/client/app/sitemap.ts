import type { MetadataRoute } from 'next';

import { topClanTags } from '@/entities/clan/clan/server';
import { mapSlugs } from '@/entities/map/map/server';
import { popularNicknames } from '@/entities/player/profile/server';
import { streamerSlugs } from '@/entities/streamer/streamer/server';
import { topTankSlugs } from '@/entities/tank/tank/server';
import { ROUTES } from '@/shared/constants';
import { SITEMAP, SITEMAP_STATIC_PATHS, sitemapEntries } from '@/shared/seo';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [tanks, clans, maps, streamers, players] = await Promise.all([
    topTankSlugs({ limit: SITEMAP.limit }),
    topClanTags({ limit: SITEMAP.limit }),
    mapSlugs({}),
    streamerSlugs({ limit: SITEMAP.limit }),
    popularNicknames({ limit: SITEMAP.limit })
  ]);

  return sitemapEntries([
    ...SITEMAP_STATIC_PATHS,
    ...tanks.flatMap((slug) => [ROUTES.tanks.detail(slug), ROUTES.builds.detail(slug)]),
    ...clans.map((tag) => ROUTES.clans.detail(tag)),
    ...maps.map((id) => ROUTES.maps.detail(id)),
    ...streamers.map((slug) => ROUTES.streamers.profile(slug)),
    ...players.map((nickname) => ROUTES.players.profile(nickname))
  ]);
};

export default sitemap;
