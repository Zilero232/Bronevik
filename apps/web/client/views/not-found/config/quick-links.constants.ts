import { isIncludedIn } from 'remeda';

import { SITE_NAV } from '@/shared/constants';

const QUICK_LINK_KEYS = ['players', 'catalog', 'tanks', 'tree', 'marks', 'builds'] as const;

export const QUICK_LINKS = SITE_NAV.groups.flatMap(({ items }) => [...items]).filter(({ key }) => isIncludedIn(key, QUICK_LINK_KEYS));
