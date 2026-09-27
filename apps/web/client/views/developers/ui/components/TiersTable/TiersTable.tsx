'use client';

import { API_TIER_LIMITS } from '@otmetki/schemas';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, Card, CardBody, CardHeader } from '@/ui-kit';

import { TIERS } from '../../../config';
import { useApiTier } from '../../../model/hooks';

import s from './TiersTable.module.scss';

export const TiersTable = () => {
  const t = useTranslations('developers.tiers');
  const format = useFormatter();
  const currentTier = useApiTier();

  return (
    <Card id='tiers'>
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
                {TIERS.list.map((tier) => (
                  <th key={tier} className={s.tier} data-current={tier === currentTier} scope='col'>
                    {tier === 'plus' ? (
                      <Link className={s.tierLink} href={ROUTES.plus}>
                        {t(`names.${tier}`)}
                      </Link>
                    ) : (
                      <span className={s.tierName}>{t(`names.${tier}`)}</span>
                    )}
                    {tier === currentTier && <Badge tone='accent'>{t('yours')}</Badge>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIERS.metrics.map((metric) => (
                <tr key={metric}>
                  <th className={s.rowLabel} scope='row'>
                    {t(`limits.${metric}`)}
                  </th>
                  {TIERS.list.map((tier) => (
                    <td key={tier} className={s.value}>
                      {format.number(API_TIER_LIMITS[tier][metric])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th className={s.rowLabel} scope='row'>
                  {t('access.label')}
                </th>
                {TIERS.list.map((tier) => (
                  <td key={tier} className={s.access}>
                    {t(`access.${tier}`)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};
