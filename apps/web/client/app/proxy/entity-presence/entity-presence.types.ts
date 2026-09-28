import type { NextRequest } from 'next/server';

import type { Locale } from '@/shared/i18n';

export type EntityLookup = {
  pattern: RegExp;
  load: (input: { key: string; signal: AbortSignal }) => Promise<{ data: unknown }>;
};

export type LocalizedPath = {
  locale: Locale;
  path: string;
};

export type MissingEntityRewriteInput = {
  request: NextRequest;
  locale: Locale;
};
