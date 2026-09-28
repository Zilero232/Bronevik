import type { NextConfig } from 'next';

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export const IMAGES: NextConfig['images'] = {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: WEEK_IN_SECONDS,
  remotePatterns: [
    { protocol: 'https', hostname: 'api.tanki.su', pathname: '/static/**' },
    // Lesta client GUI assets (vehicle renders) mirrored by unicum-gg/wot.assets.
    { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/unicum-gg/wot.assets/**' }
  ]
};

// Barrel-heavy packages whose named imports Next rewrites to per-module paths.
// `three` is a single prebuilt module, so it has nothing to gain here.
export const OPTIMIZED_PACKAGES = [
  'lucide-react',
  'remeda',
  'date-fns',
  '@react-three/drei',
  '@visx/axis',
  '@visx/curve',
  '@visx/grid',
  '@visx/scale',
  '@visx/shape',
  '@visx/tooltip',
  '@otmetki/icons'
];

// Workspace packages ship TypeScript source, not a build.
export const TRANSPILED_PACKAGES = ['@otmetki/gamedata', '@otmetki/icons', '@otmetki/ratings', '@otmetki/schemas'];
