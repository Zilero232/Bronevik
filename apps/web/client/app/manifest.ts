import type { MetadataRoute } from 'next';

import { PWA, PWA_ICONS, SITE } from '@/shared/config';

const manifest = (): MetadataRoute.Manifest => ({
  id: PWA.startUrl,
  name: SITE.name,
  short_name: SITE.name,
  description: SITE.description,
  lang: SITE.lang,
  start_url: PWA.startUrl,
  scope: PWA.startUrl,
  display: PWA.display,
  background_color: SITE.themeColor.dark,
  theme_color: SITE.themeColor.dark,
  categories: [...PWA.categories],
  icons: PWA_ICONS.map((icon) => ({ ...icon }))
});

export default manifest;
