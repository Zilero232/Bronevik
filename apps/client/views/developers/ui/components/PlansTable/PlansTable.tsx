'use client';

import { API_PLAN_LIMITS } from '@bronevik/schemas';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge, Card, CardBody, CardHeader } from '@/ui-kit';

import { PLANS } from '../../../config';
import { useCurrentPlan } from '../../../model/hooks';

import s from './PlansTable.module.scss';

export const PlansTable = () => {
  const t = useTranslations('developers.plans');
  const format = useFormatter();
  const currentPlan = useCurrentPlan();

  return (
    <Card id='plans'>
      <CardHeader title={t('title')}>
        <p className={s.description}>{t('description')}</p>
      </CardHeader>
      <CardBody>
        <div className={s.scroller}>
          <table className={s.table}>
            <thead>
              <tr>
                <th className={s.corner} scope='col'>
                  {t('limit')}
                </th>
                {PLANS.list.map((plan) => (
                  <th key={plan} className={s.plan} data-current={plan === currentPlan} scope='col'>
                    <span className={s.planName}>{t(`names.${plan}`)}</span>
                    {plan === currentPlan && <Badge tone='accent'>{t('yours')}</Badge>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLANS.metrics.map((metric) => (
                <tr key={metric}>
                  <th className={s.rowLabel} scope='row'>
                    {t(`limits.${metric}`)}
                  </th>
                  {PLANS.list.map((plan) => (
                    <td key={plan} className={s.value}>
                      {format.number(API_PLAN_LIMITS[plan][metric])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th className={s.rowLabel} scope='row'>
                  {t('access.label')}
                </th>
                {PLANS.list.map((plan) => (
                  <td key={plan} className={s.access}>
                    {t(`access.${plan}`)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className={s.legal}>{t('legal')}</p>
      </CardBody>
    </Card>
  );
};
