import { ImageResponse } from 'next/og';

import { SITE } from '@/shared/config/site';
import { OG_SIZE } from '@/shared/seo/og';
import { OG_CACHE } from '@/shared/seo/og-request';
import { loadOgFonts } from '@/shared/seo/og/server';

import type { OgImageInput } from './og-image.types';

import { FallbackOgCard } from '../../ui/FallbackOgCard';
import { ogLabels } from '../og-labels';

export const ogImage = async ({ locale, card, onError }: OgImageInput): Promise<Response> => {
  const labels = ogLabels(locale);
  const host = new URL(SITE.url).host;
  const fonts = await loadOgFonts();

  const options = (cacheControl: string) => ({ ...OG_SIZE, fonts, headers: { 'Cache-Control': cacheControl } });

  try {
    return new ImageResponse(await card({ host, labels }), options(OG_CACHE.image));
  } catch (error) {
    return onError?.(error) ?? new ImageResponse(<FallbackOgCard host={host} labels={labels} />, options(OG_CACHE.missing));
  }
};
