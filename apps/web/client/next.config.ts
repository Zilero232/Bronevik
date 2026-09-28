import type { NextConfig } from 'next';

import { withSerwist } from '@serwist/turbopack';
import createNextIntlPlugin from 'next-intl/plugin';

import rootPackage from '../../../package.json' with { type: 'json' };
import {
  CLIENT_ROOT,
  IMAGES,
  LEGACY_REDIRECTS,
  loadRootEnv,
  OPTIMIZED_PACKAGES,
  REPO_ROOT,
  securityHeaderRules,
  TRANSPILED_PACKAGES,
  WORKSPACE_PACKAGES
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
  experimental: {
    optimizePackageImports: OPTIMIZED_PACKAGES,
    // Unmatched URLs render app/global-not-found.tsx (the localized 404 inside the site
    // layout) with a real 404 status; a thrown notFound() only reaches the error shell.
    globalNotFound: true,
    // The persistent dev cache grew without bound here (8 GB → 18 GB in two hours of
    // edits) until `next dev` stopped answering; the in-memory cache is enough.
    turbopackFileSystemCacheForDev: false
  },
  sassOptions: { implementation: 'sass-embedded', loadPaths: [CLIENT_ROOT, WORKSPACE_PACKAGES] },
  turbopack: { root: REPO_ROOT, resolveAlias: { '@': CLIENT_ROOT } },
  headers: () => Promise.resolve(securityHeaderRules({ apiUrl: process.env.NEXT_PUBLIC_API_URL, isDev: process.env.NODE_ENV !== 'production' })),
  redirects: () => Promise.resolve(LEGACY_REDIRECTS)
};

export default withSerwist(withNextIntl(nextConfig));
