import type { MapDetail, MapList, MapSummary } from '@bronevik/schemas';

import { seededRandom } from '@/shared/lib';

import type { MapListInput, MinimapUrlInput } from './maps.types';

import { MAP_MOCK, MAP_SEEDS } from './maps.constants';

const minimapUrl = ({ arenaId, mode = 'ctf' }: MinimapUrlInput) =>
  `${MAP_MOCK.minimapBase}/${arenaId}${MAP_MOCK.modeSuffix.get(mode) ?? ''}${MAP_MOCK.extension}`;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '');

const hash = (value: string) => [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 11);

const summaries = (): MapSummary[] =>
  MAP_SEEDS.map(([arenaId, name, sizeMeters, camouflage, modes]) => ({
    arenaId,
    slug: slugify(arenaId),
    name,
    image: arenaId === MAP_MOCK.withoutImage ? null : minimapUrl({ arenaId }),
    sizeMeters,
    camouflage: arenaId === MAP_MOCK.withoutCamouflage ? null : camouflage,
    modes
  }));

export const mockMaps = ({ mode, search }: Omit<MapListInput, 'signal'> = {}): MapList => {
  const needle = search?.trim().toLowerCase() ?? '';

  return summaries().filter((map) => (!mode || map.modes.includes(mode)) && (needle === '' || map.name.toLowerCase().includes(needle)));
};

const detailOf = (map: MapSummary): MapDetail => {
  const random = seededRandom(hash(map.arenaId));
  const half = (map.sizeMeters ?? 1_000) / 2;
  const edge = half * 0.8;
  const hasStats = random() < MAP_MOCK.statsShare;
  const battles = Math.round(200 + random() * 4_000);
  const team1 = Math.round((47 + random() * 6) * 10) / 10;
  const team2 = Math.round((100 - team1 - 1.2) * 10) / 10;

  return {
    ...map,
    description: null,
    boundingBox: { bottomLeft: [-half, -half], upperRight: [half, half] },
    maxPlayersInTeam: MAP_MOCK.maxPlayersInTeam,
    roundLengthSec: MAP_MOCK.roundLengthSec,
    gameModes: map.modes.map((mode) => ({
      mode,
      minimap: map.image === null ? null : minimapUrl({ arenaId: map.arenaId, mode }),
      bases: { 1: [[-edge, edge]], 2: [[edge, -edge]] },
      spawns: { 1: [[-edge, edge * 0.8]], 2: [[edge, -edge * 0.8]] },
      controlPoints: mode.startsWith('domination') ? [[0, 0]] : []
    })),
    stats: hasStats
      ? {
          source: 'battles',
          battles,
          teams: [
            { team: 1, battles, winRate: team1 },
            { team: 2, battles, winRate: team2 }
          ]
        }
      : null
  };
};

export const mockMap = (idOrSlug: string): MapDetail | null => {
  const map = summaries().find(({ arenaId, slug }) => arenaId === idOrSlug || slug === idOrSlug);

  return map ? detailOf(map) : null;
};
