import { uniqueBy } from 'remeda';

import type { AbsoluteUrlInput, ListingItem, ParseListingInput } from './tanki-listing.types';

import { fromUnixSeconds } from '../../../common/lib';
import { TANKI_LISTING } from './tanki-listing.constants';

export const absoluteUrl = ({ href, baseUrl }: AbsoluteUrlInput): string | null => {
  try {
    return new URL(href.startsWith('//') ? `https:${href}` : href, baseUrl).href;
  } catch {
    return null;
  }
};

export const httpUrl = (value: string | null): string | null => (value && /^https?:\/\//.test(value) ? value : null);

export const parseTankiListing = ({ $, baseUrl }: ParseListingInput): ListingItem[] => {
  const items = $('.preview_item')
    .toArray()
    .flatMap((element) => {
      const item = $(element);
      const href = item.find('a.preview_link').first().attr('href');
      const title = item.find('.preview_title').first().text().replaceAll(/\s+/g, ' ').trim();
      const url = href ? absoluteUrl({ href, baseUrl }) : null;

      if (!url || !title) {
        return [];
      }

      const background = TANKI_LISTING.backgroundUrl.exec(item.find('.preview_image-holder').attr('style') ?? '')?.[1];
      const timestamp = Number(item.find('[data-timestamp]').first().attr('data-timestamp'));

      return [
        {
          url,
          title,
          image: background ? absoluteUrl({ href: background, baseUrl }) : null,
          publishedAt: Number.isFinite(timestamp) ? fromUnixSeconds(timestamp) : null
        }
      ];
    });

  return uniqueBy(items, (item) => item.url);
};
