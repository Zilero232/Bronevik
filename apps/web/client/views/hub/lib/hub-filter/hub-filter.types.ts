import type { SiteNavLink } from '@/shared/constants';

export type HubLink = SiteNavLink & {
  label: string;
  hint: string;
};

export type HubSectionEntry = {
  key: string;
  title: string;
  items: HubLink[];
};

export type FilterHubSectionsInput = {
  sections: HubSectionEntry[];
  query: string;
};
