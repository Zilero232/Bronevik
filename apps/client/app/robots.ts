import type { MetadataRoute } from 'next';

import { SITE } from '@/shared/config';
import { localePath, LOCALES } from '@/shared/i18n';
import { absoluteUrl, SITEMAP } from '@/shared/seo';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: [...new Set(SITEMAP.disallow.flatMap((path) => LOCALES.map((locale) => localePath({ path, locale }))))]
  },
  sitemap: absoluteUrl(SITEMAP.path),
  host: SITE.url
});

export default robots;
