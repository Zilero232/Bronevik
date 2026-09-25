'use client';

import { Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardHeader, CopyField, Skeleton } from '@/ui-kit';

import { BILLING_REFERRAL } from '../../../config';
import { useReferralLink } from '../../../model/hooks';

import s from './ReferralCard.module.scss';

export const ReferralCard = () => {
  const t = useTranslations('billing.referral');
  const link = useReferralLink();

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader action={<Gift aria-hidden className={s.icon} size={22} />} eyebrow={t('eyebrow')} title={t('title')} />
      <p className={s.lead}>{t('description', { days: BILLING_REFERRAL.bonusDays })}</p>
      {link ? <CopyField label={t('linkLabel')} tone='accent' value={link} /> : <Skeleton height={44} shape='block' />}
      <ol className={s.steps}>
        {BILLING_REFERRAL.steps.map((step, index) => (
          <li key={step} className={s.step}>
            <span className={s.index}>{index + 1}</span>
            {t(`steps.${step}`, { days: BILLING_REFERRAL.bonusDays })}
          </li>
        ))}
      </ol>
    </Card>
  );
};
