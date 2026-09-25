'use client';

import { API_PLAN_LIMITS } from '@bronevik/schemas';
import { KeyRound } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { STAGGER_ITEM } from '@/shared/lib';
import { Badge, buttonVariants } from '@/ui-kit';

import type { PlanCardProps } from './PlanCard.types';

import { planGauge } from '../../../../../lib/plan-gauge';
import { PLAN_CARD } from './PlanCard.constants';

import s from './PlanCard.module.scss';

export const PlanCard = ({ plan, isCurrent }: PlanCardProps) => {
  const t = useTranslations('developers.plans');
  const format = useFormatter();

  const limits = API_PLAN_LIMITS[plan];
  const isOpen = plan === 'free';

  return (
    <motion.li className={s.root} data-current={isCurrent} data-plan={plan} variants={STAGGER_ITEM}>
      <header className={s.head}>
        <span className={s.name}>{t(`names.${plan}`)}</span>
        {isCurrent ? <Badge tone='accent'>{t('yours')}</Badge> : <Badge tone={isOpen ? 'success' : 'neutral'}>{t(`availability.${plan}`)}</Badge>}
      </header>
      <p className={s.tagline}>{t(`taglines.${plan}`)}</p>
      <dl className={s.limits}>
        {PLAN_CARD.metrics.map(({ metric, max }) => (
          <div key={metric} className={s.limit}>
            <dt className={s.limitLabel}>{t(`limits.${metric}`)}</dt>
            <dd className={s.limitValue}>{format.number(limits[metric])}</dd>
            <span aria-hidden className={s.gauge} style={{ '--share': planGauge({ value: limits[metric], max }) }} />
          </div>
        ))}
      </dl>
      {isOpen ? (
        <Link className={buttonVariants({ variant: isCurrent ? 'secondary' : 'primary', block: true })} href={ROUTES.account.developer}>
          <KeyRound size={16} />
          {t(isCurrent ? 'cta.manage' : 'cta.free')}
        </Link>
      ) : (
        <p className={s.pending}>{t('cta.paid')}</p>
      )}
    </motion.li>
  );
};
