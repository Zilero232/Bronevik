'use client';

import { RadioTower } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import type { CodeRequestProps } from './CodeRequest.types';

import { BOT_FEATURES } from '../../../config';
import { botName } from '../../../lib/bot-link';
import { CodeTicket } from '../CodeTicket';

import s from './CodeRequest.module.scss';

export const CodeRequest = ({ code, botUsername, issuedAt, isIssuing, onIssue }: CodeRequestProps) => {
  const t = useTranslations('telegram.request');

  return (
    <section className={s.root}>
      <header className={s.header}>
        <h2 className={s.title}>{t('title')}</h2>
        <p className={s.description}>{t('description')}</p>
      </header>
      <ol className={s.steps}>
        {BOT_FEATURES.steps.map((step, index) => (
          <li key={step} className={s.step}>
            <span className={s.number}>{index + 1}</span>
            {t(`steps.${step}`, { bot: `@${botName(botUsername)}` })}
          </li>
        ))}
      </ol>
      {code ? (
        <CodeTicket botUsername={botUsername} code={code} isIssuing={isIssuing} issuedAt={issuedAt} onReissue={onIssue} />
      ) : (
        <Button block disabled={isIssuing} size='lg' onClick={onIssue}>
          <RadioTower size={18} />
          {t('issue')}
        </Button>
      )}
      <p className={s.note}>{t('note')}</p>
    </section>
  );
};
