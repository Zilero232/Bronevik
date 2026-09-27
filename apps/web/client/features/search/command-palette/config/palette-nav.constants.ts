import { uniqueBy } from 'remeda';

import type { SiteNavItem } from '@/shared/constants';

import { SITE_FOOTER_GROUPS, SITE_NAV } from '@/shared/constants';

export const PALETTE_NAV_ITEMS = uniqueBy(
  [
    ...SITE_NAV.groups.flatMap((group): readonly SiteNavItem[] => group.items),
    SITE_NAV.tools,
    SITE_NAV.plus,
    ...SITE_FOOTER_GROUPS.flatMap((group): readonly SiteNavItem[] => group.items)
  ],
  (item) => item.href
);
