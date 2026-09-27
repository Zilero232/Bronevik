'use client';

import { useTranslations } from 'next-intl';

import { Badge, Card, CardHeader, RelativeTime } from '@/ui-kit';

import type { ClaimStatusProps } from './ClaimStatus.types';

import s from './ClaimStatus.module.scss';

export const ClaimStatus = ({ claim }: ClaimStatusProps) => {
  const t = useTranslations('streamersDirectory.claim.status');

  return (
    <Card padding='md'>
      <CardHeader meta={<Badge tone={claim.status === 'dismissed' ? 'danger' : 'warning'}>{t(claim.status)}</Badge>} title={t('title')} />
      <dl className={s.list}>
        <div className={s.row}>
          <dt>{t('method')}</dt>
          <dd>{t(`methods.${claim.method}`)}</dd>
        </div>
        <div className={s.row}>
          <dt>{t('createdAt')}</dt>
          <dd>
            <RelativeTime value={claim.createdAt} />
          </dd>
        </div>
      </dl>
      {claim.status === 'open' && claim.method === 'manual' && <p className={s.note}>{t('review')}</p>}
      {claim.status === 'dismissed' && <p className={s.note}>{t('dismissedHint')}</p>}
    </Card>
  );
};
