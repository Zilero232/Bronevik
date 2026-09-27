import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import type { LestaMockEnvelope } from '../../lesta-mock.types';
import type { CreateMockFetchInput, MockRequestInput, MockServerInput } from './transport.types';

import { LESTA_MOCK } from '../../../../config';
import { nowUnix } from '../time';
import { TRANSPORT } from './transport.constants';

export const mockRoot = (baseUrl: string): string => new URL(LESTA_MOCK.mountPath, baseUrl).toString();

export const mockLoginUrl = (baseUrl: string): string => `${mockRoot(baseUrl)}${LESTA_MOCK.gamePath}${TRANSPORT.loginPath}`;

const methodOf = (url: URL): string => {
  const index = url.pathname.indexOf(LESTA_MOCK.mountPath);

  return index === -1 ? url.pathname : url.pathname.slice(index + LESTA_MOCK.mountPath.length + 1);
};

export const answerMockRequest = ({ handler, url, body, now }: MockRequestInput): LestaMockEnvelope => {
  const target = new URL(url);
  const params = Object.fromEntries([...target.searchParams, ...new URLSearchParams(body)]);

  return handler({ method: methodOf(target), params, now, loginUrl: mockLoginUrl(target.origin) });
};

export const createLestaMockFetch =
  ({ handler, clock = nowUnix }: CreateMockFetchInput) =>
  async (input: string, init: RequestInit): Promise<Response> => {
    const body = typeof init.body === 'string' ? init.body : '';
    const envelope = answerMockRequest({ handler, url: input, body, now: clock() });

    return Response.json(envelope);
  };

export const startLestaMockServer = ({ handler, baseUrl, onRealHost }: MockServerInput) => {
  const root = mockRoot(baseUrl);

  const server = setupServer(
    http.post(`${root}/*`, async ({ request }) => {
      await delay(TRANSPORT.latencyMs[0] + Math.floor(Math.random() * (TRANSPORT.latencyMs[1] - TRANSPORT.latencyMs[0])));

      return HttpResponse.json(answerMockRequest({ handler, url: request.url, body: await request.text(), now: nowUnix() }));
    }),
    ...TRANSPORT.realApiPatterns.map((pattern) =>
      http.all(pattern, ({ request }) => {
        onRealHost(request.url);

        return HttpResponse.json(
          { status: 'error', error: { code: 503, message: 'SOURCE_NOT_AVAILABLE', field: null, value: 'lesta-mock-blocked-real-host' } },
          { status: 503 }
        );
      })
    )
  );

  server.listen({ onUnhandledRequest: 'bypass' });

  return server;
};
