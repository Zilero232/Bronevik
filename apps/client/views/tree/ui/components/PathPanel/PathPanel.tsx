'use client';

import { Hammer, Info, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { AnimatedNumber, Button, buttonVariants } from '@/ui-kit';

import type { PathPanelProps } from './PathPanel.types';

import { PathSteps } from '../PathSteps';

import s from './PathPanel.module.scss';

export const PathPanel = ({ selected, steps, cost, onClear }: PathPanelProps) => {
  const t = useTranslations('tree.path');

  const { vehicle } = selected;

  return (
    <div className={s.root}>
      <TankIdentity size='lg' tank={vehicleIdentity(vehicle)} />
      <dl className={s.totals}>
        <div className={s.total}>
          <dt className={s.label}>{t('totalXp')}</dt>
          <dd className={s.value} data-kind='xp'>
            <AnimatedNumber value={cost.xp} />
          </dd>
        </div>
        <div className={s.total}>
          <dt className={s.label}>{t('totalCredits')}</dt>
          <dd className={s.value} data-kind='credits'>
            <AnimatedNumber value={cost.credits} />
          </dd>
        </div>
      </dl>
      <p className={s.caption}>{t('steps', { count: cost.steps })}</p>
      <PathSteps steps={steps} />
      <div className={s.actions}>
        <Link className={buttonVariants({ variant: 'primary', size: 'sm', block: true })} href={ROUTES.tank(vehicle.slug)}>
          <Info size={15} />
          {t('openTank')}
        </Link>
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm', block: true })} href={ROUTES.build(vehicle.slug)}>
          <Hammer size={15} />
          {t('openBuild')}
        </Link>
        <Button block size='sm' variant='ghost' onClick={onClear}>
          <X size={15} />
          {t('clear')}
        </Button>
      </div>
    </div>
  );
};
