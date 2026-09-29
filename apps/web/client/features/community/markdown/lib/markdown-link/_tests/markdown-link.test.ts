import { describe, expect, it } from 'vitest';

import { MARKDOWN } from '../../../config';
import { imageSource, markdownImageLink, markdownLinkAttributes } from '../markdown-link';

describe('markdownLinkAttributes', () => {
  it('opens external links in a new tab without passing the opener or referrer', () => {
    const attributes = markdownLinkAttributes('https://example.com');

    expect(attributes.target).toBe(MARKDOWN.externalTarget);
    expect(attributes.rel?.split(' ')).toEqual(expect.arrayContaining(['noopener', 'noreferrer', 'nofollow']));
  });

  it('leaves internal links in the same tab', () => {
    expect(markdownLinkAttributes('/guides')).toEqual({ href: '/guides' });
  });

  it('drops a script or data href instead of rendering it', () => {
    expect(markdownLinkAttributes('javascript:alert(1)')).toEqual({ href: undefined });
    expect(markdownLinkAttributes('data:text/html,x')).toEqual({ href: undefined });
  });

  it('treats a backslash host as external', () => {
    expect(markdownLinkAttributes('/\\evil.example.com').target).toBe(MARKDOWN.externalTarget);
  });
});

describe('imageSource', () => {
  it('returns only safe non-empty string sources', () => {
    expect(imageSource('https://example.com/a.png')).toBe('https://example.com/a.png');
    expect(imageSource('')).toBeUndefined();
    expect(imageSource('javascript:alert(1)')).toBeUndefined();
    expect(imageSource(new Blob())).toBeUndefined();
  });
});

describe('markdownImageLink', () => {
  it('labels the link with the alt text when there is one', () => {
    expect(markdownImageLink({ src: '/a.png', alt: 'Map' }).label).toBe('Map');
  });

  it('falls back to the safe source when the alt text is empty', () => {
    expect(markdownImageLink({ src: '/a.png', alt: '' }).label).toBe('/a.png');
  });

  it('links nowhere and shows no source for an unsafe image', () => {
    expect(markdownImageLink({ src: 'javascript:alert(1)' })).toEqual({ attributes: { href: undefined }, label: undefined });
  });
});
