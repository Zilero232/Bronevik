'use client';

import { useTranslations } from 'next-intl';

import { Card, CardBody, CardHeader } from '@/ui-kit';

import { EventPayloads, SignatureDocs } from './components';

import s from './WebhooksDocs.module.scss';

export const WebhooksDocs = () => {
  const t = useTranslations('developers.webhooks');

  return (
    <Card id='webhooks'>
      <CardHeader title={t('title')}>
        <p className={s.description}>{t('description')}</p>
      </CardHeader>
      <CardBody>
        <div className={s.layout}>
          <EventPayloads />
          <SignatureDocs />
        </div>
      </CardBody>
    </Card>
  );
};
