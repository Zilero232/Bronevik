'use client';

import { ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { RelativeTime } from '@/ui-kit';

import type { CodeMetaProps } from './CodeMeta.types';

import s from './CodeMeta.module.scss';

export const CodeMeta = ({ code, sourceHref }: CodeMetaProps) => {
  const t = useTranslations('codes.card');
  const format = useFormatter();

  return (
    <dl className={s.root}>
      <div className={s.row}>
        <dt>{t('source')}</dt>
        <dd>
          {sourceHref ? (
            <a className={s.source} href={sourceHref} rel='noopener noreferrer' target='_blank'>
              {code.source}
              <ExternalLink aria-hidden size={12} />
            </a>
          ) : (
            code.source
          )}
        </dd>
      </div>
      <div className={s.row}>
        <dt>{t('expires')}</dt>
        <dd>{code.expiresAt ? format.dateTime(new Date(code.expiresAt), { dateStyle: 'medium' }) : t('noExpiry')}</dd>
      </div>
      <div className={s.row}>
        <dt>{t('discovered')}</dt>
        <dd>
          <RelativeTime value={code.discoveredAt} />
        </dd>
      </div>
    </dl>
  );
};
