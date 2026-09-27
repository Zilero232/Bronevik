import type { NextConfig } from 'next';

import { withSerwist } from '@serwist/turbopack';
import createNextIntlPlugin from 'next-intl/plugin';

import rootPackage from '../../package.json' with { type: 'json' };
import {
  CLIENT_ROOT,
  IMAGES,
  LEGACY_REDIRECTS,
  loadRootEnv,
  OPTIMIZED_PACKAGES,
  REPO_ROOT,
  securityHeaderRules,
  TRANSPILED_PACKAGES
} from './config';

loadRootEnv();

const withNextIntl = createNextIntlPlugin('./shared/i18n/request/request.ts');

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_APP_VERSION: rootPackage.version },
  agentRules: false,
  cacheComponents: true,
  output: 'standalone',
  outputFileTracingRoot: REPO_ROOT,
  reactCompiler: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // Caddy compresses every response (zstd/gzip) in front of the standalone server.
  compress: false,
  images: IMAGES,
  transpilePackages: TRANSPILED_PACKAGES,
  experimental: { optimizePackageImports: OPTIMIZED_PACKAGES },
  sassOptions: { implementation: 'sass-embedded', loadPaths: [CLIENT_ROOT] },
  turbopack: { resolveAlias: { '@': CLIENT_ROOT } },
  headers: () => Promise.resolve(securityHeaderRules({ apiUrl: process.env.NEXT_PUBLIC_API_URL, isDev: process.env.NODE_ENV !== 'production' })),
  redirects: () => Promise.resolve(LEGACY_REDIRECTS)
};

export default withSerwist(withNextIntl(nextConfig));
