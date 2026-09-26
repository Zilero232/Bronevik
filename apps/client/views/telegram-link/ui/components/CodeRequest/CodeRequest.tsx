'use client';

import { useTranslations } from 'next-intl';

import { Button, Card, CardBody, CardHeader } from '@/ui-kit';

import type { CodeRequestProps } from './CodeRequest.types';

import { BOT_FEATURES } from '../../../config';
import { botName } from '../../../lib/bot-link';
import { CodeTicket } from '../CodeTicket';

import s from './CodeRequest.module.scss';

export const CodeRequest = ({ code, botUsername, issuedAt, isIssuing, onIssue }: CodeRequestProps) => {
  const t = useTranslations('telegram.request');

  return (
    <Card>
      <CardHeader title={t('title')} />
      <CardBody className={s.body}>
        <p className={s.description}>{t('description')}</p>
        <ol className={s.steps}>
          {BOT_FEATURES.steps.map((step) => (
            <li key={step}>{t(`steps.${step}`, { bot: `@${botName(botUsername)}` })}</li>
          ))}
        </ol>
        {code ? (
          <CodeTicket key={code.code} botUsername={botUsername} code={code} isIssuing={isIssuing} issuedAt={issuedAt} onReissue={onIssue} />
        ) : (
          <Button block disabled={isIssuing} size='lg' onClick={onIssue}>
            {t('issue')}
          </Button>
        )}
        <p className={s.note}>{t('note')}</p>
      </CardBody>
    </Card>
  );
};
