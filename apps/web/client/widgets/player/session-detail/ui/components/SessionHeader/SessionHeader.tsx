'use client';

import { Check, Link2 } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge, Button } from '@/ui-kit';

import type { SessionHeaderProps } from './SessionHeader.types';

import { useSessionHeader } from '../../../model/hooks';

import s from './SessionHeader.module.scss';

export const SessionHeader = ({ session, nickname, withShare }: SessionHeaderProps) => {
  const t = useTranslations('profile.sessions');
  const format = useFormatter();
  const { isCopied, minutes, onShare } = useSessionHeader({ session, nickname });

  const { startedAt, isLive, source, credits } = session;

  return (
    <header className={s.root}>
      <div className={s.title}>
        <h3 className={s.date}>{format.dateTime(new Date(startedAt), { day: 'numeric', month: 'long', weekday: 'long' })}</h3>
        <div className={s.meta}>
          {isLive && <Badge tone='success'>{t('live')}</Badge>}
          <span>{t(`source.${source}`)}</span>
          {minutes !== null && <span>{t('duration', { minutes })}</span>}
          {credits !== null && <span className={s.credits}>{format.number(credits, { notation: 'compact' })}</span>}
        </div>
      </div>
      {withShare && (
        <Button size='sm' variant='secondary' onClick={onShare}>
          {isCopied ? <Check size={14} /> : <Link2 size={14} />}
          {isCopied ? t('copied') : t('share')}
        </Button>
      )}
    </header>
  );
};
