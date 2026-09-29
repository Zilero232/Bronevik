import type { MetadataRoute } from 'next';

import { PLAY_MODES } from '@otmetki/schemas';

import { topClanTags } from '@/entities/clan/clan/server';
import { coachIds } from '@/entities/coaching/coach/server';
import { guideSitemapItems } from '@/entities/guide/guide/server';
import { mapSlugs } from '@/entities/map/map/server';
import { popularNicknames } from '@/entities/player/profile/server';
import { publicReplayIds } from '@/entities/replay/replay/server';
import { streamerSlugs } from '@/entities/streamer/streamer/server';
import { TANK_COLLECTION_SLUGS } from '@/entities/tank/tank';
import { topTankSlugs } from '@/entities/tank/tank/server';
import { tournamentSlugs } from '@/entities/tournament/tournament/server';
import { ROUTES } from '@/shared/constants';
import { SITEMAP, SITEMAP_STATIC_PATHS, sitemapContentEntries, sitemapEntries } from '@/shared/seo';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [tanks, clans, maps, streamers, players, replays, guides, tournaments, coaches] = await Promise.all([
    topTankSlugs({ limit: SITEMAP.limit }),
    topClanTags({ limit: SITEMAP.limit }),
    mapSlugs({}),
    streamerSlugs({ limit: SITEMAP.limit }),
    popularNicknames({ limit: SITEMAP.limit }),
    publicReplayIds({ limit: SITEMAP.limit }),
    guideSitemapItems({ limit: SITEMAP.limit }),
    tournamentSlugs({ limit: SITEMAP.limit }),
    coachIds({ limit: SITEMAP.limit })
  ]);

  return [
    ...sitemapEntries([
      ...SITEMAP_STATIC_PATHS,
      ...PLAY_MODES.map((mode) => ROUTES.modes.detail(mode)),
      ...TANK_COLLECTION_SLUGS.map((slug) => ROUTES.tanks.collection(slug)),
      ...tanks.flatMap((slug) => [ROUTES.tanks.detail(slug), ROUTES.tanks.armor(slug), ROUTES.builds.detail(slug)]),
      ...clans.map((tag) => ROUTES.clans.detail(tag)),
      ...maps.map((id) => ROUTES.maps.detail(id)),
      ...streamers.map((slug) => ROUTES.streamers.profile(slug)),
      ...players.map((nickname) => ROUTES.players.profile(nickname)),
      ...replays.map((id) => ROUTES.replays.detail(id)),
      ...tournaments.map((slug) => ROUTES.tournaments.detail(slug)),
      ...coaches.map((id) => ROUTES.coaching.coach(id))
    ]),
    ...sitemapContentEntries(guides.map(({ slug, locale }) => ({ path: ROUTES.guides.detail(slug), locale })))
  ];
};

export default sitemap;
