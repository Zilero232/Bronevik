import type { NextRequest } from 'next/server';

import createMiddleware from 'next-intl/middleware';

import { clientIpOf, isDocumentRequest, isMissingEntity, missingEntityRewrite, splitLocale } from '@/app/proxy/entity-presence';
import { routing } from '@/shared/i18n';

const intl = createMiddleware(routing);

export const proxy = async (request: NextRequest) => {
  const response = intl(request);

  if (!isDocumentRequest(request) || response.headers.has('location')) {
    return response;
  }

  const { locale, path } = splitLocale(request.nextUrl.pathname);

  return (await isMissingEntity({ path, clientIp: clientIpOf(request) })) ? missingEntityRewrite({ request, locale }) : response;
};

export const config = {
  matcher: ['/((?!api|_next|_vercel|twitch-panel|.*\\..*).*)']
};
