'use client';

import { Trash2 } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge, IconButton, RelativeTime } from '@/ui-kit';

import type { ApiKeyRowProps } from './ApiKeyRow.types';

import s from './ApiKeyRow.module.scss';

export const ApiKeyRow = ({ apiKey, onRevoke }: ApiKeyRowProps) => {
  const t = useTranslations('developer.keys');
  const tTier = useTranslations('developer.tierName');
  const format = useFormatter();

  const { name, prefix, tier, createdAt, lastUsedAt, expiresAt } = apiKey;

  return (
    <li className={s.root}>
      <div className={s.identity}>
        <span className={s.name}>{name}</span>
        <code className={s.prefix}>{prefix}…</code>
      </div>
      <Badge className={s.tier} tone={tier === 'free' ? 'steel' : 'accent'}>
        {tTier(tier)}
      </Badge>
      <dl className={s.meta}>
        <div className={s.cell}>
          <dt className={s.label}>{t('columns.created')}</dt>
          <dd className={s.value}>{format.dateTime(new Date(createdAt), { dateStyle: 'medium' })}</dd>
        </div>
        <div className={s.cell}>
          <dt className={s.label}>{t('columns.lastUsed')}</dt>
          <dd className={s.value} data-idle={lastUsedAt === null}>
            <RelativeTime fallback={t('notUsed')} value={lastUsedAt} />
          </dd>
        </div>
        <div className={s.cell}>
          <dt className={s.label}>{t('columns.expires')}</dt>
          <dd className={s.value}>{expiresAt ? format.dateTime(new Date(expiresAt), { dateStyle: 'medium' }) : t('never')}</dd>
        </div>
      </dl>
      <IconButton aria-label={t('revokeFor', { name })} className={s.revoke} variant='outline' onClick={() => onRevoke(apiKey)}>
        <Trash2 size={16} />
      </IconButton>
    </li>
  );
};
