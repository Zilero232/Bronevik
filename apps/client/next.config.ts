import type { NextConfig } from 'next';

import { withSerwist } from '@serwist/turbopack';
import createNextIntlPlugin from 'next-intl/plugin';

import rootPackage from '../../package.json' with { type: 'json' };
import {
  CLIENT_ROOT,
  FRAMEABLE_HEADER_RULES,
  IMAGES,
  LEGACY_REDIRECTS,
  loadRootEnv,
  OPTIMIZED_PACKAGES,
  REPO_ROOT,
  SECURITY_HEADERS,
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
  compress: true,
  images: IMAGES,
  transpilePackages: TRANSPILED_PACKAGES,
  experimental: { optimizePackageImports: OPTIMIZED_PACKAGES },
  sassOptions: { implementation: 'sass-embedded', loadPaths: [CLIENT_ROOT] },
  turbopack: { resolveAlias: { '@': CLIENT_ROOT } },
  headers: () => Promise.resolve([{ source: '/:path*', headers: SECURITY_HEADERS }, ...FRAMEABLE_HEADER_RULES]),
  redirects: () => Promise.resolve(LEGACY_REDIRECTS)
};

export default withSerwist(withNextIntl(nextConfig));
