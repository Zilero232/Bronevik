'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { PlanTableProps } from './PlanTable.types';

import { PLUS_CHECKOUT } from '../../../../../config';

import s from './PlanTable.module.scss';

export const PlanTable = ({ pricing, registration, isPending, isError, isRetrying, onRetry }: PlanTableProps) => {
  const t = useTranslations('plus.checkout');
  const format = useFormatter();

  return match({ isPending, isError, isEmpty: pricing.length === 0 })
    .with({ isPending: true }, () => <Skeleton height={112} shape='block' />)
    .with({ isError: true }, () => <ErrorState isRetrying={isRetrying} onRetry={onRetry} />)
    .with({ isEmpty: true }, () => <EmptyState title={t('unavailable')} />)
    .otherwise(() => (
      <table className={s.root}>
        <caption className={s.caption}>{t('planLabel')}</caption>
        <thead>
          <tr>
            <th scope='col'>{t('columns.plan')}</th>
            <th data-numeric scope='col'>
              {t('columns.price')}
            </th>
            <th data-numeric scope='col'>
              {t('columns.perMonth')}
            </th>
            <th data-numeric scope='col'>
              {t('columns.saving')}
            </th>
          </tr>
        </thead>
        <tbody>
          {pricing.map(({ plan, priceRub, perMonthRub, savingRub, savingPercent }) => (
            <tr key={plan} className={s.row}>
              <th scope='row'>
                <label className={s.choice}>
                  <input className={s.radio} type='radio' value={plan} {...registration} />
                  {t(`plans.${plan}`)}
                </label>
              </th>
              <td data-numeric>{format.number(priceRub, PLUS_CHECKOUT.priceFormat)}</td>
              <td data-numeric>{format.number(perMonthRub, PLUS_CHECKOUT.priceFormat)}</td>
              <td data-numeric data-saving={savingRub > 0}>
                {savingRub > 0 ? t('savingValue', { amount: format.number(savingRub, PLUS_CHECKOUT.priceFormat), percent: savingPercent }) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ));
};
