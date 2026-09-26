import { createSerwistRoute } from '@serwist/turbopack';
import { extname } from 'node:path';

import { PWA_ICONS } from '@/shared/config';

const REVISION = `${process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0'}-${Date.now()}`;

const CONTENT_TYPES: Record<string, string> = {
  '.js': 'application/javascript; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

const serwist = createSerwistRoute({
  swSrc: 'app/sw.ts',
  useNativeEsbuild: true,
  additionalPrecacheEntries: ['/manifest.webmanifest', ...PWA_ICONS.map(({ src }) => src)].map((url) => ({ url, revision: REVISION }))
});

const buildServiceWorkerFile = async (path: string) => {
  'use cache';

  const response = await serwist.GET(new Request(`http://localhost/serwist/${path}`), { params: Promise.resolve({ path }) });

  return response.text();
};

export const { generateStaticParams } = serwist;

export const GET = async (_request: Request, { params }: RouteContext<'/serwist/[path]'>) => {
  const { path } = await params;

  return new Response(await buildServiceWorkerFile(path), {
    headers: {
      'Content-Type': CONTENT_TYPES[extname(path)] ?? 'text/plain; charset=utf-8',
      'Service-Worker-Allowed': '/'
    }
  });
};
