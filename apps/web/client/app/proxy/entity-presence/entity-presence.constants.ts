import { clansControllerPage, mapsControllerDetail, playersControllerProfile, tanksControllerDetail } from '@/shared/api/generated';

import type { EntityLookup } from './entity-presence.types';

const tank: EntityLookup['load'] = ({ key, signal, headers }) => tanksControllerDetail({ path: { idOrSlug: key }, signal, headers });

export const ENTITY_LOOKUPS: readonly EntityLookup[] = [
  { pattern: /^\/p\/([^/]+)(?:\/|$)/, load: ({ key, signal, headers }) => playersControllerProfile({ path: { idOrNick: key }, signal, headers }) },
  { pattern: /^\/t\/([^/]+)(?:\/armor)?\/?$/, load: tank },
  { pattern: /^\/builds\/([^/]+)\/?$/, load: tank },
  { pattern: /^\/c\/([^/]+)(?:\/|$)/, load: ({ key, signal, headers }) => clansControllerPage({ path: { idOrTag: key }, signal, headers }) },
  { pattern: /^\/maps\/([^/]+)\/?$/, load: ({ key, signal, headers }) => mapsControllerDetail({ path: { idOrSlug: key }, signal, headers }) }
];

export const ENTITY_PRESENCE = {
  timeoutMs: 2000,
  missingSegment: '_missing',
  localeHeader: 'x-next-intl-locale',
  htmlAccept: 'text/html',
  forwardedForHeader: 'x-forwarded-for',
  forwardedForSeparator: ','
} as const;
