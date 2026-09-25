import { createTranslator } from 'next-intl';
import { ImageResponse } from 'next/og';

import { getPlayer } from '@/shared/api/players';
import { SITE } from '@/shared/config/site';
import { messages, resolveLocale } from '@/shared/i18n';
import { loadOgFonts, OG_SIZE } from '@/shared/seo/og';
import { PlayerOgCard } from '@/views/player-og';

type ImageProps = {
  params: Promise<{ locale: string; nick: string }>;
};

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: ImageProps) => {
  const { locale: rawLocale, nick } = await params;
  const locale = resolveLocale(rawLocale);
  const t = createTranslator({ locale, messages: messages[locale], namespace: 'profile.og' });
  const [profile, fonts] = await Promise.all([getPlayer({ idOrNick: decodeURIComponent(nick) }), loadOgFonts()]);

  return new ImageResponse(
    <PlayerOgCard
      labels={{
        eyebrow: t('eyebrow'),
        broneIndex: t('broneIndex'),
        winRate: t('winRate'),
        battles: t('battles'),
        noClan: t('noClan'),
        source: t('source')
      }}
      host={new URL(SITE.url).host}
      profile={profile}
    />,
    { ...OG_SIZE, fonts }
  );
};

export default Image;
