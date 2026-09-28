import type { NextRequest } from 'next/server';

import { INTERNAL_REQUEST } from '@otmetki/schemas';
import { NextResponse } from 'next/server';
import { isIncludedIn } from 'remeda';

import { fromSdk, isNotFoundError } from '@/shared/api/source';
import { DEFAULT_LOCALE, LOCALES } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';

import type { LocalizedPath, MissingEntityInput, MissingEntityRewriteInput } from './entity-presence.types';

import { ENTITY_LOOKUPS, ENTITY_PRESENCE } from './entity-presence.constants';

export const isDocumentRequest = (request: NextRequest) =>
  request.method === 'GET' && (request.headers.get('accept') ?? '').includes(ENTITY_PRESENCE.htmlAccept);

export const splitLocale = (pathname: string): LocalizedPath => {
  const [, first = '', ...rest] = pathname.split('/');

  return isIncludedIn(first, LOCALES) ? { locale: first, path: `/${rest.join('/')}` } : { locale: DEFAULT_LOCALE, path: pathname };
};

export const clientIpOf = (request: NextRequest): string | null => {
  const first = request.headers.get(ENTITY_PRESENCE.forwardedForHeader)?.split(ENTITY_PRESENCE.forwardedForSeparator)[0]?.trim();

  return first === undefined || first === '' ? null : first;
};

export const isMissingEntity = async ({ path, clientIp }: MissingEntityInput): Promise<boolean> => {
  const headers: Record<string, string> = clientIp ? { [INTERNAL_REQUEST.clientIpHeader]: clientIp } : {};

  for (const { pattern, load } of ENTITY_LOOKUPS) {
    const key = pattern.exec(path)?.[1];

    if (key !== undefined) {
      try {
        await fromSdk(() => load({ key: decodeRouteParam(key), signal: AbortSignal.timeout(ENTITY_PRESENCE.timeoutMs), headers }));

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
