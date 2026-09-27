'use client';

import { useTranslations } from 'next-intl';

import { CodeBlock, Tabs } from '@/ui-kit';

import { SIGNATURE_DOCS, WEBHOOK_DOCS } from '../../../../../config';

import s from './SignatureDocs.module.scss';

export const SignatureDocs = () => {
  const t = useTranslations('developers.webhooks');

  return (
    <div className={s.root}>
      <h4 className={s.heading}>{t('headersTitle')}</h4>
      <dl className={s.headers}>
        {WEBHOOK_DOCS.headers.map(({ name, key }) => (
          <div key={name} className={s.header}>
            <dt className={s.name}>{name}</dt>
            <dd className={s.meaning}>{t(`headers.${key}`)}</dd>
          </div>
        ))}
      </dl>
      <h4 className={s.heading}>{t('verifyTitle')}</h4>
      <Tabs
        items={SIGNATURE_DOCS.samples.map(({ id, language, code }) => ({
          value: id,
          label: t(`verify.${id}`),
          content: <CodeBlock code={code} language={language} title={t(`verifyFiles.${id}`)} />
        }))}
      />
      <ul className={s.notes}>
        {WEBHOOK_DOCS.notes.map(({ key, count }) => (
          <li key={key} className={s.note}>
            {t(`notes.${key}`, { count })}
          </li>
        ))}
      </ul>
    </div>
  );
};
