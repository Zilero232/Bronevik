'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import { usePathSelection } from '../../../model/hooks';
import { PathSteps } from '../PathSteps';

import s from './PathPanel.module.scss';

export const PathPanel = () => {
  const t = useTranslations('tree.path');
  const format = useFormatter();
  const { selected, steps, cost, onClear } = usePathSelection();

  if (!selected) {
    return null;
  }

  return (
    <div className={s.root}>
      <TankIdentity image='small' size='lg' tank={vehicleIdentity(selected.vehicle)} />
      <dl className={s.totals}>
        <div className={s.total}>
          <dt className={s.label}>{t('totalXp')}</dt>
          <dd className={s.value}>{format.number(cost.xp)}</dd>
        </div>
        <div className={s.total}>
          <dt className={s.label}>{t('totalCredits')}</dt>
          <dd className={s.value}>{format.number(cost.credits)}</dd>
        </div>
      </dl>
      <p className={s.caption}>{t('steps', { count: cost.steps })}</p>
      <PathSteps steps={steps} />
      <div className={s.actions}>
        <Link className={buttonVariants({ variant: 'primary', size: 'sm', block: true })} href={ROUTES.tanks.detail(selected.vehicle.slug)}>
          {t('openTank')}
        </Link>
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm', block: true })} href={ROUTES.builds.detail(selected.vehicle.slug)}>
          {t('openBuild')}
        </Link>
        <Button block size='sm' variant='ghost' onClick={onClear}>
          {t('clear')}
        </Button>
      </div>
    </div>
  );
};
