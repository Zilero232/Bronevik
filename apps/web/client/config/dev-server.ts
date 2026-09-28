import type { NextConfig } from 'next';

type Experimental = NonNullable<NextConfig['experimental']>;

// Settings that only make sense for `next dev` (options named *ForDev, the debug channel and eviction are
// dev-only in Next itself). Measured on this repo with a probe instance (20 routes in a loop + locale/scss/ts
// edits every 2.5 s); see README "Dev server troubleshooting".
const DEV_ONLY: Experimental = {
  // Keeps the persistent cache on (the Next default): Turbopack only evicts in-memory task data when it has
  // the disk cache to fall back to. Without it `next dev` grew ~300 MB/min under edits and never shrank.
  turbopackFileSystemCacheForDev: true,
  // Drop as much as possible after every cache snapshot instead of waiting for memory pressure.
  turbopackMemoryEviction: 'full',
  // The debug channel parks every HTML request's React debug stream until that page's HMR socket connects
  // (Next 16.3: "TODO: clean up after a timeout ... when CURL'ing the page"). curl, fetch, Playwright and
  // closed tabs never connect, so ~45 KB per document leaked forever. Off, the debug info rides in the RSC
  // payload as before Next 16.
  reactDebugChannel: false
};

// Build-affecting switches enabled for the dev server only, so production output stays as it was.
const DEV_BUNDLER: Experimental = {
  // React Compiler through the Rust port instead of Babel in a pool of ~16 Node child processes (~1.5 GB).
  turbopackRustReactCompiler: true,
  // Remaining webpack loaders (sass) in worker threads instead of child processes.
  turbopackPluginRuntimeStrategy: 'workerThreads'
};

export const devServerExperimental = (isDevServer: boolean): Experimental => (isDevServer ? { ...DEV_ONLY, ...DEV_BUNDLER } : {});
