export const BLOG_IMAGES = {
  root: '.data/blog',
  prefix: 'images',
  field: 'file',
  maxBytes: 4 * 1024 * 1024,
  throttle: { limit: 20, ttl: 60_000 },
  cacheControl: 'public, max-age=31536000, immutable',
  route: '/blog/images/{file}',
  types: {
    png: 'image/png',
    jpg: 'image/jpeg',
    webp: 'image/webp',
    avif: 'image/avif'
  }
} as const;
