'use client';

import { PLUS_TRIAL, REFERRAL } from '@otmetki/schemas';
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
      <CardHeader title={t('title')} />
      <p className={s.lead}>{t('description', { days: REFERRAL.bonusDays, trialDays: PLUS_TRIAL.referralDays })}</p>
      {link ? <CopyField label={t('linkLabel')} value={link} /> : <Skeleton height={44} shape='block' />}
      <ol className={s.steps}>
        {BILLING_REFERRAL.steps.map((step) => (
          <li key={step} className={s.step}>
            {t(`steps.${step}`, { days: REFERRAL.bonusDays })}
          </li>
        ))}
      </ol>
    </Card>
  );
};
