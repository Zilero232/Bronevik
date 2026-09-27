import type { SiteNavGroupEntry } from '@/shared/constants';

export type NavPanelProps = {
  group: SiteNavGroupEntry;
  activeHref: string | null;
};
