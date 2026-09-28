import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { playersControllerProfile, tanksControllerDetail } from '@/shared/api/generated';
import { NotFoundError } from '@/shared/api/source';

import { isDocumentRequest, isMissingEntity, missingEntityRewrite, splitLocale } from '../entity-presence';

vi.mock('@/shared/api/generated', () => ({
  clansControllerPage: vi.fn(),
  mapsControllerDetail: vi.fn(),
  playersControllerProfile: vi.fn(),
  tanksControllerDetail: vi.fn(async () => ({ data: {} }))
}));

describe('entity presence', () => {
  afterEach(() => {
    vi.mocked(playersControllerProfile).mockReset();
    vi.mocked(tanksControllerDetail).mockReset();
  });

  it('splits the locale prefix off a path', () => {
    expect(splitLocale('/en/p/Nick')).toEqual({ locale: 'en', path: '/p/Nick' });
    expect(splitLocale('/p/Nick')).toEqual({ locale: 'ru', path: '/p/Nick' });
  });

  it('checks only HTML page loads', () => {
    expect(isDocumentRequest(new NextRequest('http://localhost/p/x', { headers: { accept: 'text/html,application/xhtml+xml' } }))).toBe(true);
    expect(isDocumentRequest(new NextRequest('http://localhost/p/x', { headers: { accept: '*/*' } }))).toBe(false);
  });

  it('reports a missing entity when the API answers 404', async () => {
    vi.mocked(playersControllerProfile).mockRejectedValue(new NotFoundError('missing'));

    await expect(isMissingEntity('/p/No%20Such')).resolves.toBe(true);
    expect(vi.mocked(playersControllerProfile).mock.calls[0]?.[0]).toMatchObject({ path: { idOrNick: 'No Such' } });
  });

  it('lets the page render when the entity exists or the API is unreachable', async () => {
    await expect(isMissingEntity('/t/object-140/armor')).resolves.toBe(false);

    vi.mocked(tanksControllerDetail).mockRejectedValueOnce(new Error('ECONNREFUSED'));

    await expect(isMissingEntity('/builds/object-140')).resolves.toBe(false);
    await expect(isMissingEntity('/tanks')).resolves.toBe(false);
  });

  it('rewrites a missing entity to an unmatched localized path', () => {
    const response = missingEntityRewrite({ request: new NextRequest('http://localhost/en/p/x'), locale: 'en' });

    expect(response.headers.get('x-middleware-rewrite')).toBe('http://localhost/en/_missing');
    expect(response.headers.get('x-middleware-request-x-next-intl-locale')).toBe('en');
  });
});
