import type { ReadCookieInput } from './cookie.types';

export const readCookie = ({ header, name }: ReadCookieInput): string | null => {
  for (const part of (header ?? '').split(';')) {
    const separator = part.indexOf('=');

    if (separator === -1 || part.slice(0, separator).trim() !== name) {
      continue;
    }

    const raw = part.slice(separator + 1).trim();

    try {
      return decodeURIComponent(raw);
    } catch {
      return null;
    }
  }

  return null;
};
