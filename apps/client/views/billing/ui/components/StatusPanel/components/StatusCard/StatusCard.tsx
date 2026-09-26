'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, Button, buttonVariants } from '@/ui-kit';

import type { StatusCardProps } from './StatusCard.types';

import { subscriptionTone } from '../../../../../lib/status-tone';
import { useStatusCard } from '../../../../../model/hooks';
import { AutoRenewDialog } from '../AutoRenewDialog';
import { StatusFact } from '../StatusFact';

import s from './StatusCard.module.scss';

export const StatusCard = ({ status }: StatusCardProps) => {
  const t = useTranslations('billing.status');
  const format = useFormatter();
  const { endKind, renewal, cta, notice, isStartingTrial, onStartTrial } = useStatusCard({ status });

  const { isPlus, plan, status: state, currentPeriodEnd, card, plus } = status;

  return (
    <section className={s.root} data-plus={isPlus}>
      <header className={s.head}>
        <h2 className={s.title}>{t(isPlus ? 'titlePlus' : 'titleFree')}</h2>
        <Badge tone={subscriptionTone(state)}>{t(`states.${state ?? 'none'}`)}</Badge>
      </header>
      {notice?.kind === 'trial' && <p className={s.notice}>{t('trialNotice', { days: notice.daysLeft })}</p>}
      {notice?.kind === 'grace' && (
        <p className={s.notice} data-tone='warning' role='status'>
          {t('graceNotice', { date: format.dateTime(new Date(notice.until), { dateStyle: 'long' }) })}
        </p>
      )}
      <dl className={s.facts}>
        <StatusFact label={t('plan')} value={plan && state !== 'trialing' ? t(`plans.${plan}`) : t('noPlan')} />
        {endKind && currentPeriodEnd && (
          <StatusFact label={t(`periodEnd.${endKind}`)} value={format.dateTime(new Date(currentPeriodEnd), { dateStyle: 'long' })} />
        )}
        <StatusFact label={t('card')} value={card ?? t('noCard')} />
        <StatusFact label={t('autoRenew.label')} value={t(`autoRenew.${renewal}`)} />
      </dl>
      <footer className={s.actions}>
        {renewal !== 'unavailable' && <AutoRenewDialog isEnabled={renewal === 'on'} />}
        {plus.trialAvailable && (
          <Button disabled={isStartingTrial} onClick={onStartTrial}>
            {t('trialCta', { days: plus.trialDays })}
          </Button>
        )}
        <Link className={buttonVariants({ variant: isPlus || plus.trialAvailable ? 'secondary' : 'primary' })} href={ROUTES.plus}>
          {t(`cta.${cta}`)}
        </Link>
      </footer>
    </section>
  );
};
