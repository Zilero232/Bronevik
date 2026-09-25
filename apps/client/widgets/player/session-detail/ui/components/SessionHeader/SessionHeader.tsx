'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { differenceInMinutes } from 'date-fns';
import { Check, Coins, Link2, Radio } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Badge, Button } from '@/ui-kit';

import type { SessionHeaderProps } from './SessionHeader.types';

import s from './SessionHeader.module.scss';

export const SessionHeader = ({ session, nickname, withShare }: SessionHeaderProps) => {
  const t = useTranslations('profile.sessions');
  const format = useFormatter();
  const { copied, copy } = useCopy();

  const { id, startedAt, endedAt, isLive, source, credits } = session;
  const minutes = endedAt ? differenceInMinutes(new Date(endedAt), new Date(startedAt)) : null;

  const onShare = () => copy(new URL(ROUTES.playerSession({ nickname, sessionId: id }), window.location.origin).toString());

  return (
    <header className={s.root}>
      <div className={s.title}>
        <span className={s.eyebrow}>{t('eyebrow')}</span>
        <h3 className={s.date}>{format.dateTime(new Date(startedAt), { day: 'numeric', month: 'long', weekday: 'long' })}</h3>
        <div className={s.meta}>
          {isLive && (
            <Badge tone='success'>
              <Radio size={12} />
              {t('live')}
            </Badge>
          )}
          <Badge tone={source === 'mod' ? 'accent' : 'steel'}>{t(`source.${source}`)}</Badge>
          {minutes !== null && <span>{t('duration', { minutes })}</span>}
          {credits !== null && (
            <span className={s.credits}>
              <Coins size={13} />
              {format.number(credits, { notation: 'compact' })}
            </span>
          )}
        </div>
      </div>
      {withShare && (
        <Button size='sm' variant='secondary' onClick={onShare}>
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          {copied ? t('copied') : t('share')}
        </Button>
      )}
    </header>
  );
};
