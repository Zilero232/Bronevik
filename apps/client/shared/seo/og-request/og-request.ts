import { accountIdSchema } from '@bronevik/schemas';

import { resolveLocale } from '@/shared/i18n';

import type { OgPlayerRequest, OgPlayerRequestInput } from './og-request.types';

import { OG_CACHE, OG_REQUEST } from './og-request.constants';

export const parseOgPlayerRequest = ({ id, locale }: OgPlayerRequestInput): OgPlayerRequest | null => {
  if (!OG_REQUEST.digits.test(id)) {
    return null;
  }

  const parsed = accountIdSchema.safeParse(id);

  return parsed.success ? { accountId: parsed.data, locale: resolveLocale(locale ?? undefined) } : null;
};

export const ogNotFound = () => new Response(null, { status: 404, headers: { 'Cache-Control': OG_CACHE.missing } });
