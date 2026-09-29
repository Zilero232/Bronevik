import { isExternalHref, safeHref } from '@/shared/lib';

import type { MarkdownImageLink, MarkdownImageLinkInput, MarkdownImageSource, MarkdownLinkAttributes } from './markdown-link.types';

import { MARKDOWN } from '../../config';

export const markdownLinkAttributes = (href: string | undefined): MarkdownLinkAttributes => {
  const safe = safeHref(href);

  return isExternalHref(safe) ? { href: safe, target: MARKDOWN.externalTarget, rel: MARKDOWN.externalRel } : { href: safe };
};

export const imageSource = (src: MarkdownImageSource): string | undefined => (typeof src === 'string' ? safeHref(src) : undefined);

export const markdownImageLink = ({ src, alt }: MarkdownImageLinkInput): MarkdownImageLink => {
  const source = imageSource(src);

  return { attributes: markdownLinkAttributes(source), label: alt || source };
};
