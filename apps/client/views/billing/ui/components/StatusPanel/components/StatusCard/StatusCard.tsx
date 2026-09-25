'use client';

import { Crown } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, buttonVariants } from '@/ui-kit';

import type { StatusCardProps } from './StatusCard.types';

import { autoRenewState, periodEndKind, planCta } from '../../../../../lib/renewal';
import { subscriptionTone } from '../../../../../lib/status-tone';
import { AutoRenewDialog } from '../AutoRenewDialog';
import { StatusFact } from '../StatusFact';

import s from './StatusCard.module.scss';

export const StatusCard = ({ status }: StatusCardProps) => {
  const t = useTranslations('billing.status');
  const format = useFormatter();

  const { isPlus, plan, status: state, currentPeriodEnd, card } = status;
  const endKind = periodEndKind(status);
  const renewal = autoRenewState(status);
  const cta = planCta(status);

  return (
    <section className={s.root} data-plus={isPlus}>
      <header className={s.head}>
        <span aria-hidden className={s.crest}>
          <Crown size={26} strokeWidth={1.6} />
        </span>
        <div className={s.heading}>
          <span className={s.eyebrow}>{t('eyebrow')}</span>
          <h2 className={s.title}>{t(isPlus ? 'titlePlus' : 'titleFree')}</h2>
        </div>
        <Badge tone={subscriptionTone(state)}>{t(`states.${state ?? 'none'}`)}</Badge>
      </header>
      <dl className={s.facts}>
        <StatusFact label={t('plan')} value={plan ? t(`plans.${plan}`) : t('noPlan')} />
        {endKind && currentPeriodEnd && (
          <StatusFact label={t(`periodEnd.${endKind}`)} value={format.dateTime(new Date(currentPeriodEnd), { dateStyle: 'long' })} />
        )}
        <StatusFact label={t('card')} value={card ?? t('noCard')} />
        <StatusFact label={t('autoRenew.label')} value={t(`autoRenew.${renewal}`)} />
      </dl>
      <footer className={s.actions}>
        {renewal !== 'unavailable' && <AutoRenewDialog isEnabled={renewal === 'on'} />}
        <Link className={buttonVariants({ variant: isPlus ? 'secondary' : 'primary' })} href={ROUTES.plus}>
          {t(`cta.${cta}`)}
        </Link>
      </footer>
    </section>
  );
};
