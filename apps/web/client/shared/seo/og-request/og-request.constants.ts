export const OG_REQUEST = {
  localeParam: 'locale',
  digits: /^\d{1,12}$/
} as const;

export const OG_CACHE = {
  image: 'public, max-age=900, s-maxage=3600, stale-while-revalidate=86400',
  missing: 'public, max-age=300, s-maxage=300'
} as const;
