import type { NextConfig } from 'next';

import { withSerwist } from '@serwist/turbopack';
import createNextIntlPlugin from 'next-intl/plugin';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

import rootPackage from '../../../package.json' with { type: 'json' };
import {
  CLIENT_ROOT,
  devServerExperimental,
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

const createConfig = (phase: string): NextConfig => ({
  env: { NEXT_PUBLIC_APP_VERSION: rootPackage.version },
  agentRules: false,
  // A second `next dev` (an agent's probe on another port) needs its own dist dir: `.next/dev/lock`
  // allows one dev server per dist dir. Unset everywhere else.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
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
    ...devServerExperimental(phase === PHASE_DEVELOPMENT_SERVER)
  },
  sassOptions: { implementation: 'sass-embedded', loadPaths: [CLIENT_ROOT, WORKSPACE_PACKAGES] },
  turbopack: { root: REPO_ROOT, resolveAlias: { '@': CLIENT_ROOT } },
  headers: () => Promise.resolve(securityHeaderRules({ apiUrl: process.env.NEXT_PUBLIC_API_URL, isDev: process.env.NODE_ENV !== 'production' })),
  redirects: () => Promise.resolve(LEGACY_REDIRECTS)
});

export default (phase: string) => withSerwist(withNextIntl(createConfig(phase)));
