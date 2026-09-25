import type { NextConfig } from 'next';

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export const IMAGES: NextConfig['images'] = {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: WEEK_IN_SECONDS,
  remotePatterns: [{ protocol: 'https', hostname: 'api.tanki.su', pathname: '/static/**' }]
};

export const OPTIMIZED_PACKAGES = ['lucide-react', 'remeda', 'date-fns', '@bronevik/icons'];

export const TRANSPILED_PACKAGES = ['@bronevik/icons', '@bronevik/ratings', '@bronevik/schemas'];
