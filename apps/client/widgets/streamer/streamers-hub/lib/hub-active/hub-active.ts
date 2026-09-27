import { ROUTES } from '@/shared/constants';

import type { HubActiveInput } from './hub-active.types';

export const isHubActive = ({ href, pathname }: HubActiveInput): boolean =>
  href === ROUTES.streamers.list ? pathname === href : pathname.startsWith(href);
