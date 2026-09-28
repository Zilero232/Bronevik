import { clansControllerPage, mapsControllerDetail, playersControllerProfile, tanksControllerDetail } from '@/shared/api/generated';

import type { EntityLookup } from './entity-presence.types';

const tank: EntityLookup['load'] = ({ key, signal }) => tanksControllerDetail({ path: { idOrSlug: key }, signal });

export const ENTITY_LOOKUPS: readonly EntityLookup[] = [
  { pattern: /^\/p\/([^/]+)(?:\/|$)/, load: ({ key, signal }) => playersControllerProfile({ path: { idOrNick: key }, signal }) },
  { pattern: /^\/t\/([^/]+)(?:\/armor)?\/?$/, load: tank },
  { pattern: /^\/builds\/([^/]+)\/?$/, load: tank },
  { pattern: /^\/c\/([^/]+)(?:\/|$)/, load: ({ key, signal }) => clansControllerPage({ path: { idOrTag: key }, signal }) },
  { pattern: /^\/maps\/([^/]+)\/?$/, load: ({ key, signal }) => mapsControllerDetail({ path: { idOrSlug: key }, signal }) }
];

export const ENTITY_PRESENCE = {
  timeoutMs: 2000,
  missingSegment: '_missing',
  localeHeader: 'x-next-intl-locale',
  htmlAccept: 'text/html'
} as const;
