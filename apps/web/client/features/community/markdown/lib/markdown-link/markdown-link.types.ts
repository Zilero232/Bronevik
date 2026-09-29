import type { ComponentProps } from 'react';

export type MarkdownLinkAttributes = Pick<ComponentProps<'a'>, 'href' | 'rel' | 'target'>;

export type MarkdownImageSource = ComponentProps<'img'>['src'];

export type MarkdownImageLinkInput = Pick<ComponentProps<'img'>, 'alt' | 'src'>;

export type MarkdownImageLink = {
  attributes: MarkdownLinkAttributes;
  label: string | undefined;
};
