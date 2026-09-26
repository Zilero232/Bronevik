import type { MarkdownLinkAttributes } from './markdown-link.types';

import { MARKDOWN } from '../../config';

const PROTOCOL = /^[a-z][\d+.a-z-]*:/i;

const EXTERNAL_PROTOCOLS: readonly string[] = MARKDOWN.externalProtocols;

export const isExternalHref = (href: string | undefined): boolean => {
  if (!href) {
    return false;
  }

  if (href.startsWith('//')) {
    return true;
  }

  const protocol = PROTOCOL.exec(href)?.[0]?.toLowerCase();

  return protocol !== undefined && EXTERNAL_PROTOCOLS.includes(protocol);
};

export const markdownLinkAttributes = (href: string | undefined): MarkdownLinkAttributes =>
  isExternalHref(href) ? { href, target: MARKDOWN.externalTarget, rel: MARKDOWN.externalRel } : { href };

export const imageSource = (src: unknown): string | undefined => (typeof src === 'string' && src !== '' ? src : undefined);
