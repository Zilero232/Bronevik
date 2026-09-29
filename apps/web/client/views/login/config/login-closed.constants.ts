import { isIncludedIn } from 'remeda';

import { SITE_FOOTER_GROUPS } from '@/shared/constants';

export const LOGIN_CLOSED = {
  actionKeys: ['mod', 'ratings', 'status']
} as const;

type LoginClosedActionKey = (typeof LOGIN_CLOSED.actionKeys)[number];

type FooterItem = (typeof SITE_FOOTER_GROUPS)[number]['items'][number];

export const LOGIN_CLOSED_ACTIONS = SITE_FOOTER_GROUPS.flatMap(({ items }) => [...items]).filter(
  (item): item is Extract<FooterItem, { key: LoginClosedActionKey }> => isIncludedIn(item.key, LOGIN_CLOSED.actionKeys)
);
