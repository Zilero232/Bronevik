'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { EventPayloads, SignatureDocs } from './components';

import s from './WebhooksDocs.module.scss';

export const WebhooksDocs = () => {
  const t = useTranslations('developers.webhooks');

  return (
    <section className={s.root} id='webhooks'>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='04' title={t('title')} />
      <div className={s.layout}>
        <EventPayloads />
        <SignatureDocs />
      </div>
    </section>
  );
};
