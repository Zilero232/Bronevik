import type { NextRequest } from 'next/server';

import type { Locale } from '@/shared/i18n';

export type EntityLookup = {
  pattern: RegExp;
  load: (input: { key: string; signal: AbortSignal; headers: Record<string, string> }) => Promise<{ data: unknown }>;
};

export type MissingEntityInput = {
  path: string;
  clientIp: string | null;
};

export type LocalizedPath = {
  locale: Locale;
  path: string;
};

export type MissingEntityRewriteInput = {
  request: NextRequest;
  locale: Locale;
};
