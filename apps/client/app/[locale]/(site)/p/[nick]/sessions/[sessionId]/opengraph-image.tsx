import { createFormatter, createTranslator } from 'next-intl';
import { ImageResponse } from 'next/og';

import { getPlayer, getPlayerSession } from '@/shared/api/players';
import { SITE } from '@/shared/config/site';
import { messages, resolveLocale, TIME_ZONE } from '@/shared/i18n';
import { loadOgFonts, OG_SIZE } from '@/shared/seo/og';
import { SessionOgCard } from '@/views/player-og';

type ImageProps = {
  params: Promise<{ locale: string; nick: string; sessionId: string }>;
};

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: ImageProps) => {
  const { locale: rawLocale, nick, sessionId } = await params;
  const locale = resolveLocale(rawLocale);
  const t = createTranslator({ locale, messages: messages[locale], namespace: 'profile.og' });
  const format = createFormatter({ locale, timeZone: TIME_ZONE });
  const fonts = await loadOgFonts();
  const { summary } = await getPlayer({ idOrNick: decodeURIComponent(nick) });
  const session = await getPlayerSession({ accountId: summary.accountId, sessionId });

  return new ImageResponse(
    <SessionOgCard
      labels={{
        eyebrow: t('session'),
        date: format.dateTime(new Date(session.startedAt), { day: 'numeric', month: 'long', year: 'numeric' }),
        battles: t('battles'),
        winRate: t('winRate'),
        avgDamage: t('avgDamage'),
        best: t('best')
      }}
      nickname={summary.nickname}
      session={session}
    />,
    { ...OG_SIZE, fonts }
  );
};

export default Image;
