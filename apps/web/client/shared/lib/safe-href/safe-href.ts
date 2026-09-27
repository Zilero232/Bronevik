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

export const safeHref = (href: string | null | undefined): string | undefined => {
  const trimmed = href?.trim();

  if (!trimmed) {
    return undefined;
  }

  const scheme = schemeOf(trimmed);

  return scheme === null || PROTOCOLS.includes(scheme) ? trimmed : undefined;
};

export const safeWebHref = (href: string | null | undefined): string | undefined => {
  const trimmed = href?.trim();

  if (!trimmed) {
    return undefined;
  }

  const scheme = schemeOf(trimmed);

  return scheme !== null && WEB_PROTOCOLS.includes(scheme) ? trimmed : undefined;
};
