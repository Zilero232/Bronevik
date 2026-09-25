'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { Clock, Shield } from 'lucide-react';
import { useFormatter, useLocale, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Avatar } from '@/ui-kit';

import { useProfileContext } from '../../../../../model/context';

import s from './HeroIdentity.module.scss';

export const HeroIdentity = () => {
  const t = useTranslations('profile.hero');
  const format = useFormatter();
  const locale = useLocale();
  const { profile, accountId, nickname } = useProfileContext();

  const { clan, createdAt, lastBattleAt } = profile.summary;
  const dateLocale = locale === 'ru' ? ru : enUS;

  return (
    <div className={s.root}>
      <span className={s.eyebrow}>{t('eyebrow', { id: accountId })}</span>
      <div className={s.name}>
        <Avatar className={s.avatar} name={nickname} size='lg' />
        <h1 className={s.nickname}>{nickname}</h1>
      </div>
      <div className={s.meta}>
        {clan ? (
          <Link className={s.clan} href={ROUTES.clan(clan.tag)}>
            <Shield size={14} />
            <span className={s.tag}>[{clan.tag}]</span>
            {clan.name}
          </Link>
        ) : (
          <span className={s.muted}>{t('noClan')}</span>
        )}
        {createdAt && (
          <span className={s.muted}>{t('since', { date: format.dateTime(new Date(createdAt), { year: 'numeric', month: 'long' }) })}</span>
        )}
        {lastBattleAt && (
          <span className={s.muted}>
            <Clock size={13} />
            {t('lastBattle', { ago: formatDistanceToNowStrict(new Date(lastBattleAt), { addSuffix: true, locale: dateLocale }) })}
          </span>
        )}
      </div>
    </div>
  );
};
