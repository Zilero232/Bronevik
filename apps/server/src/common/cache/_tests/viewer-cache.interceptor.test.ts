import type { Cache } from '@nestjs/cache-manager';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import type { UserSession } from '@thallesp/nestjs-better-auth';

import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import { CACHE_BY_VIEWER } from '../cache.constants';
import { ViewerCacheInterceptor } from '../viewer-cache.interceptor';

const URL = '/me/goals';

type Setup = {
  method?: string;
  byViewer?: boolean;
  userId?: string;
};

const trackBy = async ({ method = 'GET', byViewer = false, userId }: Setup) => {
  const reflector = mock<Reflector>();
  const adapterHost = mockDeep<HttpAdapterHost>();
  const context = mock<ExecutionContext>();
  const http = mock<HttpArgumentsHost>();
  const session = userId ? mock<UserSession>({ user: { id: userId } }) : null;

  reflector.get.mockImplementation((key) => (key === CACHE_BY_VIEWER ? byViewer : undefined));
  adapterHost.httpAdapter.getRequestMethod.mockReturnValue(method);
  adapterHost.httpAdapter.getRequestUrl.mockReturnValue(URL);
  http.getRequest.mockReturnValue({ method, session });
  context.switchToHttp.mockReturnValue(http);

  const cache = mock<Cache>();
  const next = mock<CallHandler>();

  cache.get.mockResolvedValue({ cached: true });
  next.handle.mockReturnValue(of({ fresh: true }));

  const interceptor = Object.assign(new ViewerCacheInterceptor(cache, reflector), { httpAdapterHost: adapterHost });

  await interceptor.intercept(context, next);

  return cache.get.mock.calls[0]?.[0];
};

describe('ViewerCacheInterceptor', () => {
  it('shares the cache entry of a public route between viewers', async () => {
    expect(await trackBy({ userId: 'u1' })).toBe(URL);
  });

  it('keys a per-viewer route by the signed-in user so nobody sees another user’s data', async () => {
    const first = await trackBy({ byViewer: true, userId: 'u1' });
    const second = await trackBy({ byViewer: true, userId: 'u2' });

    expect(first).toContain(URL);
    expect(first).not.toBe(second);
  });

  it('keeps the shared key for an anonymous visitor of a per-viewer route', async () => {
    expect(await trackBy({ byViewer: true })).toBe(URL);
  });

  it('never caches a non-GET request', async () => {
    expect(await trackBy({ method: 'POST', byViewer: true, userId: 'u1' })).toBeUndefined();
  });
});
