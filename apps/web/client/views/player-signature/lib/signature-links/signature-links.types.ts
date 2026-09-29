import type { SIGNATURE_SNIPPETS } from '../../config';

type SignatureSnippet = (typeof SIGNATURE_SNIPPETS)[number];

export type SignatureLinksInput = {
  nickname: string;
  apiUrl: string;
  siteUrl: string;
};

export type SignatureLinks = Record<SignatureSnippet, string> & {
  imageUrl: string;
  profileUrl: string;
};
