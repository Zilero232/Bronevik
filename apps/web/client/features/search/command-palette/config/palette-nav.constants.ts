import { uniqueBy } from 'remeda';

import type { SiteNavItem } from '@/shared/constants';

import { SITE_LINKS } from '@/shared/constants';

export const PALETTE_NAV_ITEMS = uniqueBy(Object.values<SiteNavItem>(SITE_LINKS), (item) => item.href);
