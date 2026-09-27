import { isExternalHref, safeHref } from '@/shared/lib';

import type { MarkdownLinkAttributes } from './markdown-link.types';

import { MARKDOWN } from '../../config';

export const markdownLinkAttributes = (href: string | undefined): MarkdownLinkAttributes => {
  const safe = safeHref(href);

  return isExternalHref(safe) ? { href: safe, target: MARKDOWN.externalTarget, rel: MARKDOWN.externalRel } : { href: safe };
};

export const imageSource = (src: unknown): string | undefined => (typeof src === 'string' ? safeHref(src) : undefined);
