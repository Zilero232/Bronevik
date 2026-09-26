import { describe, expect, it } from 'vitest';

import { imageSource, isExternalHref, markdownLinkAttributes } from '../markdown-link';

describe('isExternalHref', () => {
  it('treats http, https, mailto and protocol-relative links as external', () => {
    expect(isExternalHref('https://tanki.su')).toBe(true);
    expect(isExternalHref('HTTP://example.com')).toBe(true);
    expect(isExternalHref('mailto:someone@example.com')).toBe(true);
    expect(isExternalHref('//cdn.example.com/x')).toBe(true);
  });

  it('keeps relative paths and anchors internal', () => {
    expect(isExternalHref('/guides')).toBe(false);
    expect(isExternalHref('#tactics')).toBe(false);
    expect(isExternalHref('maps/malinovka')).toBe(false);
  });

  it('never marks a missing or unknown-protocol href as external', () => {
    expect(isExternalHref(undefined)).toBe(false);
    expect(isExternalHref('')).toBe(false);
    expect(isExternalHref('ftp://files.example.com')).toBe(false);
  });
});

describe('markdownLinkAttributes', () => {
  it('opens external links in a new tab without passing the opener or referrer', () => {
    const attributes = markdownLinkAttributes('https://example.com');

    expect(attributes.target).toBe('_blank');
    expect(attributes.rel?.split(' ')).toEqual(expect.arrayContaining(['noopener', 'noreferrer', 'nofollow']));
  });

  it('leaves internal links in the same tab', () => {
    expect(markdownLinkAttributes('/guides')).toEqual({ href: '/guides' });
  });
});

describe('imageSource', () => {
  it('returns only non-empty string sources', () => {
    expect(imageSource('https://example.com/a.png')).toBe('https://example.com/a.png');
    expect(imageSource('')).toBeUndefined();
    expect(imageSource(new Blob())).toBeUndefined();
  });
});
