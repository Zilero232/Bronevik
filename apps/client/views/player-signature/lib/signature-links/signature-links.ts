import { ROUTES } from '@/shared/constants';

import type { SignatureLinks, SignatureLinksInput } from './signature-links.types';

import { SIGNATURE_IMAGE } from '../../config';

export const signatureLinks = ({ nickname, apiUrl, siteUrl }: SignatureLinksInput): SignatureLinks => {
  const imageUrl = `${apiUrl.replace(/\/+$/u, '')}${SIGNATURE_IMAGE.path}${encodeURIComponent(nickname)}${SIGNATURE_IMAGE.extension}`;
  const profileUrl = new URL(ROUTES.players.profile(nickname), siteUrl).toString();

  return {
    imageUrl,
    profileUrl,
    bbcode: `[url=${profileUrl}][img]${imageUrl}[/img][/url]`,
    html: `<a href="${profileUrl}"><img src="${imageUrl}" width="${SIGNATURE_IMAGE.width}" height="${SIGNATURE_IMAGE.height}" alt="${nickname}"></a>`,
    markdown: `[![${nickname}](${imageUrl})](${profileUrl})`,
    image: imageUrl
  };
};
