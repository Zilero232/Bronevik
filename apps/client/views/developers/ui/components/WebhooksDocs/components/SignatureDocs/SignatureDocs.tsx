'use client';

import { RotateCcw, ShieldCheck, TimerOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CodeBlock, Tabs } from '@/ui-kit';

import { WEBHOOK_DOCS } from '../../../../../config';
import { webhookSamples } from '../../../../../lib/code-samples';

import s from './SignatureDocs.module.scss';

const SAMPLES = webhookSamples();

export const SignatureDocs = () => {
  const t = useTranslations('developers.webhooks');

  const notes = [
    { key: 'tolerance', icon: <TimerOff size={16} />, text: t('notes.tolerance', { minutes: WEBHOOK_DOCS.toleranceMinutes }) },
    { key: 'retries', icon: <RotateCcw size={16} />, text: t('notes.retries', { count: WEBHOOK_DOCS.retries }) },
    { key: 'disable', icon: <ShieldCheck size={16} />, text: t('notes.disable', { count: WEBHOOK_DOCS.disableAfter }) }
  ];

  return (
    <div className={s.root}>
      <h3 className={s.heading}>{t('headersTitle')}</h3>
      <dl className={s.headers}>
        {WEBHOOK_DOCS.headers.map(({ name, key }) => (
          <div key={name} className={s.header}>
            <dt className={s.name}>{name}</dt>
            <dd className={s.meaning}>{t(`headers.${key}`)}</dd>
          </div>
        ))}
      </dl>
      <h3 className={s.heading}>{t('verifyTitle')}</h3>
      <Tabs
        items={SAMPLES.map(({ id, language, code }) => ({
          value: id,
          label: t(`verify.${id}`),
          content: <CodeBlock code={code} language={language} title={t(`verifyFiles.${id}`)} />
        }))}
      />
      <ul className={s.notes}>
        {notes.map(({ key, icon, text }) => (
          <li key={key} className={s.note}>
            <span aria-hidden className={s.icon}>
              {icon}
            </span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};
