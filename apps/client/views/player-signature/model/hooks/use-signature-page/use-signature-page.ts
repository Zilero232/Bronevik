'use client';

import { useBoolean } from '@siberiacancode/reactuse';

import { usePlayerProfile } from '@/entities/player/profile';
import { env, SITE } from '@/shared/config';

import { SIGNATURE_SNIPPETS } from '../../../config';
import { signatureLinks } from '../../../lib/signature-links';

export const useSignaturePage = (nickname: string) => {
  const profile = usePlayerProfile(nickname);
  const [isImageBroken, setImageBroken] = useBoolean(false);

  const canonical = profile.data?.summary.nickname ?? null;
  const links = canonical ? signatureLinks({ nickname: canonical, apiUrl: env.NEXT_PUBLIC_API_URL, siteUrl: SITE.url }) : null;

  return {
    nickname: canonical ?? nickname,
    links,
    snippets: links ? SIGNATURE_SNIPPETS.map((id) => ({ id, value: links[id] })) : [],
    query: profile,
    isImageBroken,
    onImageError: () => setImageBroken(true)
  };
};
