import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { isIncludedIn } from 'remeda';

import { fromSdk, isNotFoundError } from '@/shared/api/source';
import { DEFAULT_LOCALE, LOCALES } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';

import type { LocalizedPath, MissingEntityRewriteInput } from './entity-presence.types';

import { ENTITY_LOOKUPS, ENTITY_PRESENCE } from './entity-presence.constants';

export const isDocumentRequest = (request: NextRequest) =>
  request.method === 'GET' && (request.headers.get('accept') ?? '').includes(ENTITY_PRESENCE.htmlAccept);

export const splitLocale = (pathname: string): LocalizedPath => {
  const [, first = '', ...rest] = pathname.split('/');

  return isIncludedIn(first, LOCALES) ? { locale: first, path: `/${rest.join('/')}` } : { locale: DEFAULT_LOCALE, path: pathname };
};

export const isMissingEntity = async (path: string): Promise<boolean> => {
  for (const { pattern, load } of ENTITY_LOOKUPS) {
    const key = pattern.exec(path)?.[1];

    if (key !== undefined) {
      try {
        await fromSdk(() => load({ key: decodeRouteParam(key), signal: AbortSignal.timeout(ENTITY_PRESENCE.timeoutMs) }));

        return false;
      } catch (error) {
        return isNotFoundError(error);
      }
    }
  }

  return false;
};

export const missingEntityRewrite = ({ request, locale }: MissingEntityRewriteInput) => {
  const headers = new Headers(request.headers);

  headers.set(ENTITY_PRESENCE.localeHeader, locale);

  return NextResponse.rewrite(new URL(`/${locale}/${ENTITY_PRESENCE.missingSegment}`, request.url), { request: { headers } });
};
