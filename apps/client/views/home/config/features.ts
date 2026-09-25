import { SITE_NAV } from '@/shared/constants';

export const HOME_FEATURES = SITE_NAV.map((item, index) => ({
  ...item,
  index: String(index + 1).padStart(2, '0'),
  isWide: index < 2 || index >= SITE_NAV.length - 2
}));
