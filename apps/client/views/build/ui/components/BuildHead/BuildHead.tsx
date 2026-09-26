'use client';

import { Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { TankPicker } from '@/features/tank/pick-tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, PageHeader } from '@/ui-kit';

import { useBuildHead } from '../../../model/hooks';

import s from './BuildHead.module.scss';

export const BuildHead = () => {
  const t = useTranslations('builds.head');
  const { vehicle, onPick, onShare } = useBuildHead();

  const tank = vehicleIdentity(vehicle);

  return (
    <div className={s.root}>
      <TankImage isPriority className={s.render} size='big' tank={tank} />
      <PageHeader
        actions={
          <>
            <TankPicker className={s.picker} label={t('picker')} value={vehicle} onChange={onPick} />
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.tank(vehicle.slug)}>
              {t('toTank')}
            </Link>
            <Button size='sm' variant='secondary' onClick={onShare}>
              <Share2 size={14} />
              {t('share')}
            </Button>
          </>
        }
        className={s.header}
        description={t('lead')}
        meta={<TankIdentity tank={tank} />}
        title={t('title', { name: vehicle.name })}
      />
    </div>
  );
};
