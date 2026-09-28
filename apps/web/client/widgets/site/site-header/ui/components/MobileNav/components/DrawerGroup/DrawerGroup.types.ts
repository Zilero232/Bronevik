import type { SiteNavIcon } from '@/shared/constants';

export type DrawerGroupLink = {
  key: string;
  href: string;
  icon: SiteNavIcon;
  label: string;
};

export type DrawerGroupProps = {
  value: string;
  label: string;
  links: readonly DrawerGroupLink[];
  activeHref: string | null;
  isActive: boolean;
  onNavigate: () => void;
};
