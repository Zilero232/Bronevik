import type { ParsedHref } from './safe-href.types';

import { SAFE_HREF } from './safe-href.constants';

const PROTOCOLS: readonly string[] = SAFE_HREF.protocols;
const WEB_PROTOCOLS: readonly string[] = SAFE_HREF.webProtocols;

const isPrintable = (char: string): boolean => {
  const code = char.codePointAt(0) ?? 0;

  return code >= SAFE_HREF.printableFrom && code !== SAFE_HREF.deleteChar;
};

const schemeOf = (href: string): string | null => SAFE_HREF.scheme.exec([...href].filter(isPrintable).join(''))?.[0]?.toLowerCase() ?? null;

export const isExternalHref = (href: string | null | undefined): boolean => {
  if (!href) {
    return false;
  }

  if (SAFE_HREF.protocolRelative.test(href)) {
    return true;
  }

  const scheme = schemeOf(href);

  return scheme !== null && PROTOCOLS.includes(scheme);
};

const parseHref = (href: string | null | undefined): ParsedHref | null => {
  const trimmed = href?.trim();

  return trimmed ? { href: trimmed, scheme: schemeOf(trimmed) } : null;
};

export const safeHref = (href: string | null | undefined): string | undefined => {
  const parsed = parseHref(href);

  return parsed && (parsed.scheme === null || PROTOCOLS.includes(parsed.scheme)) ? parsed.href : undefined;
};

export const safeWebHref = (href: string | null | undefined): string | undefined => {
  const parsed = parseHref(href);

  return parsed?.scheme && WEB_PROTOCOLS.includes(parsed.scheme) ? parsed.href : undefined;
};
