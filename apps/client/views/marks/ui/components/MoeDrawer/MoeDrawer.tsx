'use client';

import { MarkOfExcellenceIcon } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, DeltaValue, Drawer } from '@/ui-kit';

import type { MoeDrawerProps } from './MoeDrawer.types';

import { DRAWER_THRESHOLDS } from '../../../config';
import { thresholdVerdict } from '../../../lib/moe-thresholds';
import { MasteryLadder, MoeHistoryChart } from './components';

import s from './MoeDrawer.module.scss';

export const MoeDrawer = ({ row, isOpen, onOpenChange }: MoeDrawerProps) => {
  const t = useTranslations('marks.drawer');
  const format = useFormatter();

  return (
    <Drawer className={s.root} open={isOpen} title={row?.vehicle.name ?? t('title')} onOpenChange={onOpenChange}>
      {row && (
        <div className={s.body}>
          <div className={s.identity}>
            <TankIdentity withNation size='lg' tank={vehicleIdentity(row.vehicle)} />
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.tank(row.vehicle.slug)}>
              {t('openTank')}
            </Link>
          </div>
          <section className={s.block}>
            <h3 className={s.heading}>{t('thresholds')}</h3>
            <dl className={s.thresholds}>
              {DRAWER_THRESHOLDS.map(({ key, marks }) => (
                <div key={key} className={s.threshold} data-key={key}>
                  <dt className={s.thresholdLabel}>
                    {marks && <MarkOfExcellenceIcon aria-hidden marks={marks} size={18} />}
                    {t(`levels.${key}`)}
                  </dt>
                  <dd className={s.thresholdValue}>{row.moe?.[key] ? format.number(row.moe[key]) : '—'}</dd>
                </div>
              ))}
            </dl>
            <div className={s.trend}>
              <span>{t('delta7')}</span>
              <DeltaValue value={row.trend.p95Delta7d ?? 0} verdict={thresholdVerdict(row.trend.p95Delta7d)} />
              <span>{t('delta30')}</span>
              <DeltaValue value={row.trend.p95Delta30d ?? 0} verdict={thresholdVerdict(row.trend.p95Delta30d)} />
            </div>
          </section>
          <section className={s.block}>
            <h3 className={s.heading}>{t('history')}</h3>
            <MoeHistoryChart tankId={row.vehicle.tankId} />
          </section>
          <section className={s.block}>
            <h3 className={s.heading}>{t('mastery')}</h3>
            <MasteryLadder mastery={row.mastery} />
          </section>
        </div>
      )}
    </Drawer>
  );
};
