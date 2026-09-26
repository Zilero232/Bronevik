import { ROUTES } from '@/shared/constants';

import type { QuickLinkTarget } from './quick-links.types';

import { QUICK_LINKS } from '../../config/quick-links.constants';

export const quickLinkTargets = (nickname: string): QuickLinkTarget[] => {
  const hrefs = {
    profile: ROUTES.players.profile(nickname),
    marks: ROUTES.marks,
    account: ROUTES.account.overview,
    tools: ROUTES.tools
  } as const;

  return QUICK_LINKS.map((key) => ({ key, href: hrefs[key] }));
};
