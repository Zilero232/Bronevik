import type { SiteNavGroupEntry } from '@/shared/constants';

export type NavPanelLinkProps = {
  item: SiteNavGroupEntry['items'][number];
  isActive: boolean;
};
