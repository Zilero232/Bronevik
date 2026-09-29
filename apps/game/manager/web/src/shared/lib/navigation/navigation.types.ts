import type { PAGE_IDS } from '../../config';

export type PageId = (typeof PAGE_IDS)[number];

export type NavigationParams = {
  preset?: string | null;
  profileCode?: string;
  components?: string[];
};

export type NavigationTarget = {
  page: PageId;
  params?: NavigationParams;
};

export type NavigationValue = {
  page: PageId;
  params: NavigationParams;
  navigate: (target: NavigationTarget) => void;
};
